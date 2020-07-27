const mongoose = require('mongoose');

const CuponesSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    descuento:{
        type: Number,
        required: true,
        trim: true
    },
    vigencia:{
        type: Date,
        default: Date.now()
    },
    empresa:{
        type: mongoose.Schema.Types.ObjectId,
        ref: ('Empresa') 
    }
});

module.exports = mongoose.model('Cupon', CuponesSchema);