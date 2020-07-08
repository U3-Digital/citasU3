const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    apellido:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true      
    },
    status: {
        type: String,
        required: true,
        trim: true          
    },
    rol: {
        type: String,
        required: true,
        trim: true  
    },
    empresa:{
        type: mongoose.Schema.Types.ObjectId,
        ref: ('Empresa') 
    }
});

module.exports = mongoose.model('Usuario',UsuariosSchema);