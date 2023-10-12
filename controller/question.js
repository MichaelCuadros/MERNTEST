const Question = require("../Model/question");
const History = require("../Model/history");
const User = require("../Model/user");
const Module = require("../Model/module");
const Course = require("../Model/course");
const Compra = require("../Model/compra");

const register = async (req, res) => {
  try {
    const userRank = req.user.rank;

    // Comprobar si el usuario es administrador
    if (userRank === "admin") {
      const user_found = await User.findOne({ _id: req.user.id });

      // Doble verificación del rango de usuario
      if (user_found && user_found.rank === userRank) {
        // Verificar si todos los datos requeridos están presentes
        if (
          req.body.question &&
          req.body.answer &&
          req.body.nameModule &&
          req.body.code
        ) {
          const course = await Course.findOne({ code: req.body.code });

          // Verificar si el curso se encontró
          if (!course) {
            return res.status(400).send({
              status: "400",
              message: "Curso no encontrado",
            });
          }

          // Buscar el módulo por nombre y courseId
          const module_found = await Module.findOne({
            name: req.body.nameModule,
            courseId: course._id,
          });

          if (!module_found) {
            return res.status(400).send({
              status: "400",
              message: "Módulo no encontrado",
            });
          }

          // Crear nueva pregunta y guardarla
          const question_to_save = new Question({
            question: req.body.question,
            answer: req.body.answer,
            moduleId: module_found._id,
          });
          await question_to_save.save();

          // Registrar en el historial
          const history = new History({
            userId: req.user.id,
            description: `Creación de pregunta (${req.body.question}) en el módulo ${module_found.name}`,
          });
          await history.save();

          return res.status(200).send({
            status: "200",
            message: "Se creó la pregunta correctamente",
            userRank,
            question_to_save,
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
          message: "Faltan Permisos",
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

const question_list_by_module_codeCourse = async (req, res) => {
  try {
    const user = req.user;
    const user_found = await User.findById(user.id);
    if (user_found.isEnabled === true) {
      // Verificar si los datos necesarios están en el cuerpo de la solicitud
      if (!req.body.name || !req.body.code) {
        return res.status(400).send({
          status: "400",
          message: "Faltan datos",
        });
      }

      // Buscar el curso por código
      const course = await Course.findOne({ code: req.body.code });

      // Verificar si el curso se encontró
      if (!course) {
        return res.status(400).send({
          status: "400",
          message: "Curso no encontrado",
        });
      }

      // Buscar el módulo por nombre y courseId
      const module = await Module.findOne({
        name: req.body.name,
        courseId: course._id,
      });

      if (!module) {
        return res.status(400).send({
          status: "400",
          message: "Módulo no encontrado",
        });
      }

      if (!user_found.modules.includes(module._id)) {
        return res.status(400).send({
          status: "400",
          message: "El user no tiene acceso al modulo",
        });
      }

      // Buscar preguntas asociadas al módulo
      const questions = await Question.find({ moduleId: module._id });

      // Registro en historial
      const history = new History({
        userId: req.user.id, // Asumiendo que tienes la información del usuario en req.user
        description: `Usuario solicitó preguntas del módulo ${module.name} del curso ${course.code}`,
      });
      await history.save();

      return res.status(200).send({
        status: "200",
        message: "Operación exitosa",
        questions,
        module,
      });
    } else {
      // Si el usuario no está habilitado, enviar un mensaje de error
      return res.status(403).send({
        status: "403",
        message: "Usuario no habilitado",
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

const question_list_by_module = async (req, res) => {
  try {
    const user = req.user;
    const user_found = await User.findById(user.id);
    if (user_found.isEnabled === true) {
      // Verificar si los datos necesarios están en el cuerpo de la solicitud
      if (!req.params.idModule) {
        return res.status(400).send({
          status: "400",
          message: "Faltan datos",
        });
      }
    }

    if (!user_found.modules.includes(req.params.idModule)) {
      return res.status(400).send({
        status: "400",
        message: "El usuario no compró",
      });
    }

    const questions = await Question.find({ moduleId: req.params.idModule });
    return res.status(200).send({
      status: "200",
      message: "Operación exitosa",
      questions,
    });
  } catch (error) {
    return res.status(500).send({
      status: "500",
      message: "ERROR INESPERADO",
      error: error.message,
    });
  }
};

const question_free_list_by_module = async (req, res) => {
  try {
    const user = req.user;
    const user_found = await User.findById(user.id);
    if (user_found.isEnabled === true) {
      // Verificar si los datos necesarios están en el cuerpo de la solicitud
      if (!req.params.idModule) {
        return res.status(400).send({
          status: "400",
          message: "Faltan datos",
        });
      }
    }

    const module_found = await Module.findById(req.params.idModule);

    if (module_found.isFree == true) {
      const questions = await Question.find({ moduleId: req.params.idModule });
      return res.status(200).send({
        status: "200",
        message: "Operación exitosa",
        questions,
      });
    }

    if (!user_found.modules.includes(req.params.idModule)) {
      return res.status(400).send({
        status: "400",
        message: "El usuario no compró",
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

const list_questions_by_compra = async (req, res) => {
  try {
    const user = req.user;
    const user_found = await User.findOne({_id:user.id});
    if (user_found.isEnabled === true) {
      // Asegurar que se proporcionan los datos necesarios
      if (!req.body.idModule) {
        return res.status(400).send({
          status: "400",
          message: "Faltan datos",
        });
      }

      // Verificar la compra
      const compra = await Compra.findOne({
        userId: user_found._id,
        moduleId: req.body.idModule,
      });

      if (!compra) {
        return res.status(400).send({
          status: "400",
          message: "Compra no encontrada",
        });
      }

      // Verificar la fecha de expiración
      const currentDate = new Date();
      if (compra.expiration_at < currentDate) {
        return res.status(400).send({
          status: "400",
          message: "La compra ha expirado",
        });
      }

      // Buscar preguntas asociadas al módulo
      const questions = await Question.find({ moduleId: req.body.idModule });

      return res.status(200).send({
        status: "200",
        message: "Operación exitosa",
        questions,
      });
    } else {
      return res.status(403).send({
        status: "403",
        message: "Usuario no habilitado",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: "500",
      message: "ERROR INESPERADO",
      error: error.message,
    });
  }
};



module.exports = {
  register,
  question_list_by_module_codeCourse,
  question_list_by_module,
  question_free_list_by_module,
  list_questions_by_compra
};
