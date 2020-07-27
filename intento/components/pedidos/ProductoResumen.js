import React, {useContext, useState, useEffect} from 'react'
import PedidoContext from '../../context/pedidos/PedidoContext';

const ProductoResumen = ({producto}) =>{

    //context de pedidos
    const pedidocontext = useContext(PedidoContext);
    const {cantidadProductos, actualizarTotal} = pedidocontext;

    const [cantidad, setCantidad] = useState(1);
    useEffect(() =>{
        actualizarCantidad();
        actualizarTotal();
    },[cantidad])

    const actualizarCantidad = () =>{
        const nuevoProducto = {...producto,cantidad: Number(cantidad)}
        cantidadProductos(nuevoProducto);

    }

    const {nombre, precio} = producto;
    return (
        <div className="md:flex md:justify-between md:items-center mt-5">
            <div className="md:w-2/4 mb-2 md:mb-0">
                <p className="text-sm">{nombre}</p>
                <p>$ {precio}</p>
            </div>
            
        </div>
    )
}

export default ProductoResumen;