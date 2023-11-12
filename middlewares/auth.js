//importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");
//importar clave secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret_key;
const User=require("../Model/user");
//Middleware de autentificacion
const auth = async(req, res, next) => {//next es un metodo que me permite saltar a la siguiente accion
    //Comprobar si me llega la cabecera de autentificacion
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "la peticion no tiene la cabecera de autentificacion"
        })
    }
    //decodoficar el token
    //limpiar token
   let token = req.headers.authorization.replace(/['"]+/g, '');// ' y "" lo vamos a quitar de manera global en el string /g y lo cambiaremos por '' osea nada
    try {
    

            //decodificar token
        let payload = jwt.decode(token, secret);

        const user_found = await User.findOne({token_: token});
        if (!user_found) {
            return res.status(401).send({
                status: "error",
                message: "Token expirado o inválido",
            });
        }

        //comprobar expiracion del token
        if (payload.exp <= moment().unix()) {//si la fecha de expiracion es menor que la fecha actual devolvemos un error
            return res.status(401).send({
                status: "error",
                message: "Token expirado",
            })
        }
        //agregar datos de usuario a request
        req.user = payload;
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Token invalido",
            error
        })
    }

    //pasar a la ejecucion de la accion
    next();
}
module.exports={auth}
