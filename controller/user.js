const User = require("../Model/user");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const Course = require("../Model/course");
const History = require("../Model/history"); // Asegúrate de importar el modelo de History
const moment = require("moment");
const Module = require("../Model/module");
const Compra=require("../Model/compra");

const checkDatabaseConnection = async (req, res) => {
  try {
      // Intenta hacer una consulta simple
      await mongoose.connection.db.admin().ping();

      return res.status(200).send({
          status: "200",
          message: "Conectado"
      });
  } catch (error) {
      return res.status(500).send({
          status: "500",
          message: "Desconectado",
          error: error.message
      });
  }
};

const register = async (req, res) => {
  try {
    const { name, username, password, number, group } = req.body;

    // Validar campos requeridos
    if (!name || !username || !password || !number || !group) {
      return res.status(400).send({
        status: "400",
        message: "Faltan datos",
      });
    }

    // Verificar si el nombre de usuario ya existe
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).send({
        status: "400",
        message: "El nombre de usuario ya existe",
      });
    }

    // Verificar si el número de WhatsApp ya existe
    const numberExists = await User.findOne({ number });
    if (numberExists) {
      return res.status(400).send({
        status: "400",
        message: "El número de WhatsApp ya está registrado",
      });
    }

    // Encriptar contraseña
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar usuario
    const user = new User({
      name,
      username,
      password: encryptedPassword,
      number,
      group,
    });
    await user.save();

    return res.status(200).send({
      status: "200",
      message: "Registro exitoso",
    });
  } catch (error) {
    return res.status(500).send({
      status: "500",
      message: "ERROR INESPERADO",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const params = req.body;

    if (!params.username || !params.password) {
      return res.status(400).send({
        status: "400",
        message: "Faltan datos por enviar",
      });
    }

    const user = await User.findOne({ username: params.username });
    if (!user) {
      return res.status(400).send({
        status: "400",
        message: "Usuario no encontrado",
      });
    }

    const passwordIsValid = bcrypt.compareSync(params.password, user.password);
    if (!passwordIsValid) {
      return res.status(400).send({
        status: "400",
        message: "Contraseña incorrecta",
      });
    }

    if (user.isEnabled) {
      const token_old = user.token; // Recuperar el token antiguo

      const token = jwt.createToken(user); // Generar el nuevo token
      user.token_ = token; // Guardar el nuevo token en token_

      delete user.password;

      user.logins.push(Date.now());
      await user.save(); // Guardar el usuario con el nuevo token y el antiguo

      const user_to_send = {
        username: user.username,
        name: user.name,
      };
      return res.status(200).send({
        status: "200",
        message: "Bienvenido",
        user_to_send,
        token,
      });
    } else {
      return res.status(400).send({
        status: "400",
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

const add_course_to_user = async (req, res) => {
  try {
    if (req.user.rank !== "admin") {
      return res.status(403).send({
        status: "403",
        message: "No tienes permiso para realizar esta acción",
      });
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).send({
        status: "400",
        message: "Usuario no encontrado",
      });
    }

    const course = await Course.findOne({ code: req.body.code });
    if (!course) {
      return res.status(400).send({
        status: "400",
        message: "Curso no encontrado",
      });
    }

    if (user.courses.includes(course._id.toString())) {
      return res.status(400).send({
        status: "400",
        message: "El usuario ya tiene este curso registrado",
      });
    }

    user.courses.push(course._id);
    await user.save();

    course.userIds.push(user._id);
    await course.save();

    // Registro en el historial
    const history = new History({
      userId: req.user.id,
      description: `Se agregó el curso ${course.name} al usuario ${user.username}`,
    });
    await history.save();

    return res.status(200).send({
      status: "200",
      message: "Curso agregado exitosamente al usuario",
    });
  } catch (error) {
    return res.status(500).send({
      status: "500",
      message: "ERROR INESPERADO",
      error: error.message,
    });
  }
};

const add_module_to_user = async (req, res) => {
  try {
    if (req.user.rank !== "admin") {
      return res.status(403).send({
        status: "403",
        message: "No tienes permiso para realizar esta acción",
      });
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).send({
        status: "400",
        message: "Usuario no encontrado",
      });
    }

    const course = await Course.findOne({ code: req.body.code });
    const module = await Module.findOne({
      courseId: course._id,
      name: req.body.name,
    });
    if (!module) {
      return res.status(400).send({
        status: "400",
        message: "Módulo no encontrado",
      });
    }

    if (user.modules.includes(module._id)) {
      return res.status(400).send({
        status: "400",
        message: "El usuario ya tiene este módulo registrado",
      });
    }

    user.modules.push(module._id);
    await user.save();

    // Registro en el historial
    const history = new History({
      userId: req.user.id,
      description: `Se agregó el módulo ${module.name} al usuario ${user.username}`,
    });
    await history.save();

    return res.status(200).send({
      status: "200",
      message: "Módulo agregado exitosamente al usuario",
    });
  } catch (error) {
    return res.status(500).send({
      status: "500",
      message: "ERROR INESPERADO",
      error: error.message,
    });
  }
};

const add_compra = async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.user.rank !== "admin") {
      return res.status(403).json({
        status: "403",
        message: "No tienes permiso para realizar esta acción",
      });
    }

    // Validar la entrada del usuario
    const { username, idModule } = req.body;
    if (!username || !idModule) {
      return res.status(400).json({
        status: "400",
        message: "Datos de entrada no válidos",
      });
    }

    // Buscar usuario y módulo en la base de datos
    const user_found = await User.findOne({ username });
    const module_found = await Module.findOne({ _id: idModule });

    // Verificar si el usuario y el módulo existen
    if (!user_found || !module_found) {
      return res.status(404).json({
        status: "404",
        message: "Usuario o módulo no encontrado",
      });
    }

    // Verificar si el usuario ya ha comprado el módulo
    const existing_compra = await Compra.findOne({
      userId: user_found._id,
      moduleId: module_found._id,
    });

    if (existing_compra) {
      return res.status(400).json({
        status: "400",
        message: "Ya habías comprado antes el módulo",
      });
    }

    // Crear nueva compra
    const new_compra = new Compra({
      userId: user_found._id,
      moduleId: module_found._id,
      // Si tienes campos adicionales, puedes añadirlos aquí
    });

    // Registro en el historial
    const history = new History({
      userId: req.user.id,
      description: `Compra de ${new_compra.userId} al usuario ${new_compra.moduleId}`,
    });
    await history.save();

    // Guardar la nueva compra en la base de datos
    await new_compra.save();

    // Responder con éxito
    return res.status(200).json({
      status: "200",
      message: "Compra verificada",
      new_compra,
    });

  } catch (error) {
    // Manejar errores inesperados
    console.error(error);  // Loguear el error en la consola del servidor
    return res.status(500).json({
      status: "500",
      message: "Error inesperado",
      error: error.message,  // Incluir información del error
    });
  }
};

const comando = (req, res) => {
  // Es solo un comando de prueba, así que no hay mucho que hacer aquí
  const params = req.body;
  return res.status(200).send({
    status: "200",
    message: "muy bien",
    params,
  });
};

module.exports = {
  checkDatabaseConnection,
  register,
  login,
  add_course_to_user,
  add_module_to_user,
  add_compra,
  comando,
};
