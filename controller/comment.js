const History = require("../Model/history");
const User = require("../Model/user");
const Comment = require("../Model/comment");

const STATUS_BAD_REQUEST = 400;
const STATUS_SUCCESS = 200;

const registerComment = async (req, res) => {
  const { moduleId, comment } = req.body;

  if (!moduleId || !comment) {
    return res.status(STATUS_BAD_REQUEST).send({
      message: "Faltan Datos",
    });
  }

  try {
    const userFound = await User.findOne({ _id: req.user.id });

    const existingComment = await Comment.findOne({
      userId: userFound._id,
      moduleId,
    });

    if (existingComment) {
      return res.status(STATUS_BAD_REQUEST).send({
        message: "Ya hiciste un comentario",
      });
    }

    const newComment = new Comment({
      userId: userFound._id,
      moduleId,
      comment
    });

    await newComment.save();

    // Registrar en el historial
    const history = new History({
      userId:userFound._id,
      description: `Creación de comentario (${userFound._id}) en el módulo ${moduleId}`,
    });
    await history.save();

    return res.status(STATUS_SUCCESS).send({
        status:"200",
      message: "success",
      newComment,
      insignias: userFound.symbols,
    });
  } catch (error) {
    // Aquí puedes manejar el error, por ejemplo, enviar una respuesta con un código de estado 500.
    console.error("Error al registrar comentario:", error);
    return res.status(500).send({ message: "Error interno del servidor" });
  }
};



const list = async (req, res) => {
    try {
        const _moduleId = req.params.idModule;

        let comments = await Comment.find({ moduleId: _moduleId }).populate('userId', 'symbols name group');

        // Convertir los comentarios a JSON para poder modificarlos


        return res.status(STATUS_SUCCESS).send({
            status: "200",
            message: "success",
            comments
        });

    } catch (error) {
        console.error("Error al listar los comentarios:", error);
        return res.status(500).send({ message: "Error interno del servidor" });
    }
}
module.exports = { registerComment,list };