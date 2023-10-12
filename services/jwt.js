const jwt=require('jwt-simple');
const moment=require('moment');

const secret_key="clave_secreta";

const createToken=(user)=>{
    const payload={
        id:user._id,
        name:user.name,
        username:user.username,
        rank:user.rank,
        iat:moment().unix(),//momento en el que se crea
        exp: moment().add(59, "minute").unix()//fecha de vencimiento
    }

    return jwt.encode(payload,secret_key);
}

module.exports={
    secret_key,
    createToken
}