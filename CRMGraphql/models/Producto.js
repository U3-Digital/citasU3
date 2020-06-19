const mongoose = require('mongoose');

const ProductosSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        trim: true
    }
});


ProductosSchema.index({nombre : 'text'});
module.exports = mongoose.model('Producto',ProductosSchema);