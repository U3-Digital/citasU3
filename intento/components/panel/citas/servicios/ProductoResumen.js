import React, {useContext, useState, useEffect} from 'react'
import PedidoContext from '../../../../context/pedidos/PedidoContext';

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
        <div className="flex justify-between ml-2">
            <p className="flex justify items-center my-2" >
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-1 mt-1" stroke="currentColor"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>  
                {nombre}  
            </p>
            <p>
                ${precio}
            </p>
        </div>
        
    )
}

export default ProductoResumen;