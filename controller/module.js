const Module = require("../Model/module");
const History = require("../Model/history");
const Course = require("../Model/course");
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
        if (params.name && params.description && params.codeCourse) {
          const course_found = await Course.findOne({
            code: params.codeCourse,
          });

          // Verificar si el curso existe
          if (!course_found) {
            return res.status(400).send({
              status: "400",
              message: "Curso no encontrado",
            });
          }

          // Verificar si ya existe un módulo con ese nombre en el curso específico
          const module_found = await Module.findOne({
            name: params.name,
            courseId: course_found._id,
          });

          if (module_found) {
            return res.status(400).send({
              status: "400",
              message: "Ese nombre ya existe en este curso",
            });
          }

          const module_to_save = new Module({
            name: params.name,
            description: params.description,
            url:params.url,
            courseId: course_found._id,
            price:params.price
          });
          await module_to_save.save();

          // Registrar la acción en el historial
          const history = new History({
            userId: req.user.id,
            description: `Creación de modulo (${params.name}) en el curso ${course_found.name}`,
          });
          await history.save();

          return res.status(200).send({
            status: "200",
            message: "Se creó el módulo correctamente",
            userRank,
            module_to_save,
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

const module_list = async (req, res) => {
  try {
    // Obtener el ID del usuario a partir del objeto de la solicitud
    const idUser = req.user.id;

    // Buscar al usuario en la base de datos usando su ID
    const user_found = await User.findById(idUser);

    // Verificar si el usuario está habilitado
    if (user_found && user_found.isEnabled) {
      // Buscar módulos asociados a los cursos del usuario
      const modules = await Module.find({
        courseId: { $in: user_found.courses },
      });

      // Registrar la acción en el historial
      const history = new History({
        userId: idUser,
        description: "Solicitó la lista de módulos",
      });
      await history.save();

      // Devolver los módulos encontrados
      return res.status(200).send({
        status: "200",
        message: "Operación exitosa",
        modules,
      });
    } else {
      // Si el usuario no está habilitado, enviar un mensaje de error
      return res.status(403).send({
        status: "403",
        message: "Usuario no habilitado",
      });
    }
  } catch (error) {
    // Manejar errores inesperados
    return res.status(500).send({
      status: "500",
      message: "ERROR INESPERADO",
      error: error.message,
    });
  }
};

const module_list_by_course = async (req, res) => {
  try {
    const params = req.body;
    const courseCode = req.params.code;
    
    // Buscar el curso usando el código proporcionado
    const course_found = await Course.findOne({ code:courseCode });

    // Si el curso no se encuentra, enviar un mensaje de error
    if (!course_found) {
      return res.status(404).send({
        status: "404",
        message: "Course not found",
      });
    }

    // Obtener los módulos asociados al curso
    const modules = await Module.find({ courseId: course_found._id });


    // Enviar la lista de módulos como respuesta
    return res.status(200).send({
      status: "200",
      message: "Successful",
      modules,
      portada:course_found.url_portada
    });
  } catch (error) {
    // Manejo de errores generales (por ejemplo, errores de base de datos)
    return res.status(500).send({
      status: "500",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getModuleById = async (req, res) => {
  try {
    const moduleId = req.params.idModule;
    const module = await Module.findById(moduleId);

    if (!module) {
      return res.status(404).send({
        status: "404",
        message: "Módulo no encontrado",
      });
    }

    return res.status(200).send({
      status: "200",
      message: "Operación exitosa",
      module,
    });
  } catch (error) {
    return res.status(500).send({
      status: "500",
      message: "ERROR INESPERADO",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  module_list,
  module_list_by_course,
  getModuleById
};
