const mongoose = require('mongoose');

const PedidosSchema = mongoose.Schema({
    pedido:{
        type: Array,
        require: true
    },
    total:{
        type: Number,
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: ('Cliente') 
    },
    empleado: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: ('Usuario') 
    },
    estado: {
        type: String,
        default: "PENDIENTE"
    },
    fecha:{
        type: Date,
        default: Date.now()
    }
    
});

module.exports = mongoose.model('Pedido',PedidosSchema);