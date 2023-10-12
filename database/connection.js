const mongoose = require('mongoose');
const connection = async () => {
    try {
        await mongoose.connect("mongodb+srv://1524:1524@serverlessinstanceapp99.8ztdeie.mongodb.net/app_ase");
        console.log("base de datos conectada");
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo conectar a la base de datos");
    }
}
module.exports = {
    connection
}