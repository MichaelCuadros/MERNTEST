const History = require("../Model/history");
const User = require("../Model/user");
const Media = require("../Model/media");

const Register = async (req, res) => {
    try {
        const userRank = req.user.rank;

        // Verificar si el usuario es administrador
        if (userRank === "admin") {
            const user_found = await User.findOne({ _id: req.user.id });

            // Doble verificación de que el usuario es administrador
            if (user_found.rank === userRank) {
                const params = req.body;

                // Comprobar que los datos necesarios están presentes
                if (params.description && params.userId && params.moduleId) {

                    // Crear y guardar el media
                    const media_to_save = new Media(params);
                    await media_to_save.save();

                    // Registrar la acción en el historial
                    const history = new History({
                        userId: req.user.id,
                        description: `Creación de media (${params.title || "Sin título"})`,
                    });
                    await history.save();

                    return res.status(200).send({
                        status: "200",
                        message: "Media creado exitosamente",
                        media_to_save,
                        userRank,
                    });
                } else {
                    return res.status(400).send({
                        status: "400",
                        message: "Faltan datos",
                    });
                }
            } else {
                return res.status(403).send({
                    status: "403",
                    message: "No tienes permiso para realizar esta acción",
                });
            }
        } else {
            return res.status(403).send({
                status: "403",
                message: "No tienes permiso para realizar esta acción",
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: "500",
            message: "ERROR INESPERADO",
            error: error.message,
        });
    }
};

module.exports = { Register };