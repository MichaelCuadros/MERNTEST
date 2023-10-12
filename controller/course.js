const Course = require("../Model/course");
const History = require("../Model/history");
const User = require("../Model/user");

const register = async (req, res) => {
    try {
      const userRank = req.user.rank;
  
      // Verificar si el usuario es administrador
      if (userRank === "admin") {
        const user_found = await User.findOne({ _id: req.user.id });
  
        // Doble verificación de que el usuario es administrador
        if (user_found.rank === userRank) {
          const params = req.body;
  
          // Comprobar que los datos necesarios están presentes
          if (params.code && params.name && params.description)  {
            // Verificar si ya existe un curso con el mismo código o nombre
            const course_found = await Course.findOne({
              $or: [{ code: params.code }, { name: params.name }]
            });
  
            if(!params.url){
              params.url="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fbimchannel.net%2Fwp-content%2Fuploads%2F2015%2F05%2FFormacion-R.png&f=1&nofb=1&ipt=d66444049fc45dede5da63de47332890c66a3059c425d9afa35fcb0039ec8e2b&ipo=images";
            }

            if (!course_found) {
              const course_to_save = new Course(params);
              await course_to_save.save();
  
              // Registrar la acción en el historial
              const history = new History({
                userId: req.user.id,
                description: `Creación de curso (${params.name})`,
              });
              await history.save();
  
              return res.status(200).send({
                status: "200",
                message: "Curso creado exitosamente",
                course_to_save,
                userRank,
              });
            } else {
              return res.status(400).send({
                status: "400",
                message: "Ya existe un curso con ese código o nombre",
              });
            }
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

/**
 * Función para listar todos los cursos.
 * Solo puede ser accedido por administradores.
 */
const courses_list = async (req, res) => {
  try {
    // Consultar la lista de cursos
    const courses = await Course.find();

    // Registro en historial
   // let history = new History({
    //  description: "Consulta de lista de cursos",
   // });
   // await history.save();

    // Enviar la respuesta con la lista de cursos
    return res.status(200).send({
      status: "200",
      message: "Consulta exitosa",
      courses,
    });
  } catch (error) {
    // Manejo de errores inesperados
    return res.status(500).send({
      status: "500",
      message: "ERROR INESPERADO",
      error: error.message,
    });
  }
};


module.exports = { register, courses_list };
