const mongoose = require('mongoose');
mongoose.set('strictQuery',false);
const { config } = require('dotenv');

config();

const connection = async () => {
    try {
        await mongoose.connect("mongodb://161.132.47.13:27017/mi_redsocial);
        console.log("base de datos conectada");
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo conectar a la base de datos");
    }
}
module.exports = {
    connection
}
