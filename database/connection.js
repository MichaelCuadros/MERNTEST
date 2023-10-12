const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("base de datos conectada");
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo conectar a la base de datos");
    }
}

module.exports = {
    connection
}