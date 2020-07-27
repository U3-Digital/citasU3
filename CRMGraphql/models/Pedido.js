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
    },
    empresa:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: ('Empresa') 
    },
    cupon:{
        type: mongoose.Schema.Types.ObjectId,
        ref: ('Cupon')
    }
    
});

module.exports = mongoose.model('Pedido',PedidosSchema);