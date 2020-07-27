import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select';
import {gql, useQuery} from '@apollo/client'
import PedidoContext from '../../../../context/pedidos/PedidoContext';

const OBTENER_CUPONES  = gql`
    query obtenerCuponesValidos{
        obtenerCuponesValidos{
            nombre
            vigencia
            descuento
            id
        }
    }
`;



const AsignarCupon = () =>{
    const [cupon,setCupon] = useState({descuento: 0, nombre:"Sin descuento",id: null});
    const [descuento, setDescuento] = useState({descuento: 0, nombre:"Sin descuento",id: null})
    //context de pedidos
    const pedidocontext = useContext(PedidoContext);
    const {agregarCupon} = pedidocontext;

    //consultar la BD
    const {data,loading,error} =useQuery(OBTENER_CUPONES);

    useEffect(() =>{
        agregarCupon(descuento);
    },[descuento])
    const SeleccionarCupon = cupones =>{
        setCupon(cupones);
        setDescuento(cupones);
    }

    if(loading) return null;
    const {obtenerCuponesValidos} = data;
    const opciones = [{descuento: 0, nombre:"Sin descuento"},...obtenerCuponesValidos]

    return(
        <Select
            className="mt-3 xl:w-1/3 ml-2" 
            options={opciones}
            onChange ={(opcion) =>SeleccionarCupon(opcion)}
            getOptionValue={opciones => opciones.descuento}
            getOptionLabel={opciones => `${opciones.nombre} ${opciones.descuento}%`}
            placeholder= "Seleccione el cupon"
            noOptionsMessage= {() =>"No hay resultados"}
            isSearchable= {true}
            value = {cupon}
        />
    )
}

export default AsignarCupon;