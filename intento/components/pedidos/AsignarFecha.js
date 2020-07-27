import React,{useState,useEffect, useContext} from 'react'
import Select from 'react-select';
import PedidoContext from '../../context/pedidos/PedidoContext';

const AsignarFecha = () =>{
    const [fecha,setFecha] = useState([]);

    //context de pedidos
    const pedidocontext = useContext(PedidoContext);
    const {agregarFecha} = pedidocontext;

    useEffect(() =>{
        agregarFecha(fecha);
    },[fecha])

    const seleccionafecha= (fechas) =>{
        setFecha(fechas)
    }
    return(
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold ">3.- Asigna una fecha para la cita</p>
            <input 
            className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="fecha"
            type= "date"
            onChange={selectedOption => {
                seleccionafecha(selectedOption.target.value)
            }}
            />
        </>   
    )

}

export default AsignarFecha;