const mongoose = require('mongoose');
const { config } = require('dotenv');

config();

const connection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("base de datos conectada");
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo conectar a la base de datos");
    }
}
module.exports = {
    connection
}