import React,{useContext} from 'react'
import PedidoContext from '../../../../context/pedidos/PedidoContext';

const Total = () =>{

    //context de pedidos
    const pedidocontext = useContext(PedidoContext);
    const {total} = pedidocontext;

    return(
        <p className=" font-bold text-gray-800 flex justify-end  text-lg"> Total: ${total}</p>
    )
}

export default Total;