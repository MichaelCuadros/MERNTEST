const { Schema, model } = require('mongoose');

const CompraSchema = Schema({
    userId: {
        type: Schema.ObjectId
    },
    moduleId: {
        type: Schema.ObjectId
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    expiration_at: {
        type: Date,
        default: function() {
            var expirationDate = new Date(this.create_at);  // Obtén la fecha de creación
            expirationDate.setDate(expirationDate.getDate() + 7);  // Añade 7 días
            return expirationDate;
        }
    },
});

module.exports = model("Compra", CompraSchema, "compras");