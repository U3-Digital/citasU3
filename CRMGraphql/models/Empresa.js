const mongoose = require('mongoose');

const EmpresaSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    direccion:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    facebook:{
        type: String,
        trim: true
    },
    instagram:{
        type: String,

        trim: true
    },
    whatsapp:{
        type: String,
        trim: true
    },
    fotos:{
        type: String
    },
    status: {
        type: String,
        required: true,
        trim: true          
    }
});

module.exports = mongoose.model('Empresa',EmpresaSchema);