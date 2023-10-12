const {Schema, model} = require('mongoose');

const ModuleSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    courseId: {
        type: Schema.ObjectId
    },
    url: {
        type: String,
        required: true
    },
    isFree: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number, // Tipo de dato para el precio
        default: 0,   // Puedes establecer un precio predeterminado si lo deseas, aquí es 0
        min: 0       // Asegurarse de que el precio no sea negativo
    }
});

module.exports=model("Module",ModuleSchema,"modules");