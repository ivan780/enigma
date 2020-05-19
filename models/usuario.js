const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


let usuarioSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "El correo es necesario"],
    }, password: {
        type: String,
        required: [true, "Le contraseña es obligatoria"],
    },
});


module.exports = mongoose.model('Usuario', usuarioSchema)