import React,{useState,useEffect, useContext} from 'react'
import Select from 'react-select';
import {gql, useQuery} from '@apollo/client'
import PedidoContext from '../../context/pedidos/PedidoContext';

const options = [
    { value: '8:00', label: '8:00' },
    { value: '9:00', label: '9:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '12:00', label: '12:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
    { value: '17:00', label: '17:00' },
    { value: '18:00', label: '18:00' },
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' }
  ]
  


const AsignarHora = () =>{
    const [hora, setHora] = useState([]);

    //context de pedidos
    const pedidocontext = useContext(PedidoContext);
    const {agregarHora} = pedidocontext;


    useEffect(() =>{
        agregarHora(hora);
    },[hora])

    const seleccionaHora = horas =>{
        setHora(horas.value);
    }


    return(
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold ">4.- Asigna una hora para la cita</p>
            <Select
                className="mt-3" 
                options={options}
                onChange ={(opcion) =>seleccionaHora(opcion)}
                placeholder= "Seleccione el Horario"
                noOptionsMessage= {() =>"No hay resultados"}
            />
        </>
    )
}

export default AsignarHora;