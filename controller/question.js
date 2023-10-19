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


const getQuestionsByModule = async (req, res) => {
  try {
      const { idModule } = req.body;
      const { id, modules, isEnabled } = req.user;

      if (!idModule) {
          return sendResponse(res, 400, "Faltan datos");
      }

      if (!isEnabled) {
          return sendResponse(res, 403, "Usuario no autorizado o no habilitado");
      }

      if (!modules.includes(idModule)) {
          return sendResponse(res, 400, "El usuario no compró este módulo");
      }

      const questions = await Question.find({ moduleId: idModule });
      return sendResponse(res, 200, "Operación exitosa", { questions });
      
  } catch (error) {
      return sendResponse(res, 500, "ERROR INESPERADO", { error: error.message });
  }
};

const getFreeModuleQuestions = async (req, res) => {
  try {
      const module = await Module.findById(req.params.idModule);

      if (!module) {
          return sendResponse(res, 404, "Módulo no encontrado");
      }

      if (!module.isFree) {
          return sendResponse(res, 403, "El módulo no es gratuito");
      }

      const questions = await Question.find({ moduleId: req.params.idModule });
      return sendResponse(res, 200, "Operación exitosa", { questions });
      
  } catch (error) {
      return sendResponse(res, 500, "ERROR INESPERADO", { error: error.message });
  }
};

const getQuestionsByPurchase = async (req, res) => {
  try {
      const { idModule } = req.params;
      const { id, isEnabled } = req.user;

      if (!idModule) {
          return sendResponse(res, 400, "Faltan datos");
      }

      if (!isEnabled) {
          return sendResponse(res, 403, "Usuario no habilitado");
      }

      const purchase = await Compra.findOne({ userId: id, moduleId: idModule });
      if (!purchase) {
          return sendResponse(res, 400, "Compra no encontrada");
      }

      if (purchase.expiration_at < new Date()) {
          return sendResponse(res, 400, "La compra ha expirado");
      }

      const questions = await Question.find({ moduleId: idModule });
      return sendResponse(res, 200, "Operación exitosa", { questions });
      
  } catch (error) {
      return sendResponse(res, 500, "ERROR INESPERADO", { error: error.message });
  }
};

module.exports = {
  register,
getFreeModuleQuestions,
getQuestionsByModule,
getQuestionsByPurchase
};
