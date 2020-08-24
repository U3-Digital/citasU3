const mongoose = require('mongoose');

const ClientesSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    creado:{
        type: Date,
        default: Date.now()
    },
    password:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    status:{
        type: String,
        required: true,
        trim: true  ,
        default: "PENDIENTE"
    },
    empresa:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: ('Empresa') 
    }]
   
});
module.exports = mongoose.model('Cliente',ClientesSchema);