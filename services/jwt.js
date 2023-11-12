const jwt=require('jwt-simple');
const moment=require('moment');
const { config } = require('dotenv');

config();

const secret_key="123";

const createToken=(user)=>{
    const payload = {
        id: user._id,
        name: user.name,
        username: user.username,
        rank: user.rank,
        iat: moment().unix(), // momento en el que se crea
        exp: moment().add(7, "days").unix() // fecha de vencimiento en 7 días
    }


    return jwt.encode(payload,secret_key);
}

module.exports={
    secret_key,
    createToken
}
