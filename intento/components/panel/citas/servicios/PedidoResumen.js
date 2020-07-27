import React,{useContext} from 'react'
import PedidoContext from '../../../../context/pedidos/PedidoContext';
import ProductoResumen from './ProductoResumen';

const PedidoResumen = () =>{

    //context de pedidos
    const pedidocontext = useContext(PedidoContext);
    const {productos} = pedidocontext;

    return(
        <div className="ml-2 py-2">
            {productos !== null && productos.length > 0 && productos  ? (
                <>
                    {productos.map( producto =>(
                        <ProductoResumen 
                            key={producto.id}
                            producto= {producto}
                        />
                    ))}
                </>
            ): (
                <>
                <p className="mt-5 text-sm flex justify-center">aún no hay productos</p>
                </>
            )}
        </div>    
    );
}

export default PedidoResumen;