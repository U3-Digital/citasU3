import React,{useState,useEffect, useContext} from 'react'
import Select from 'react-select';
import {gql, useQuery} from '@apollo/client'
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesEmpresa{
    obtenerClientesEmpresa{
      id
      nombre
      apellido
      email
      telefono
      status
      empresa{
        nombre
      }
    }
  }
`;




const AsignarCliente = () =>{

    const [cliente,setCliente] = useState([]);

    //context de pedidos
    const pedidocontext = useContext(PedidoContext);
    const {agregarCliente} = pedidocontext;

    //consultar la BD
    const {data,loading,error} =useQuery(OBTENER_CLIENTES_USUARIO);

    useEffect(() =>{
        agregarCliente(cliente);
    },[cliente])

    const seleccionarCliente = clientes =>{
        setCliente(clientes);
    }

    //resultados de la consulta 
    if(loading) return null;
    const {obtenerClientesEmpresa} =data;

    return(
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold ">1.- Asigna un cliente al pedido</p>
            <Select
                className="mt-3" 
                options={obtenerClientesEmpresa}
                onChange ={(opcion) =>seleccionarCliente(opcion)}
                getOptionValue={opciones => opciones.id}
                getOptionLabel={opciones => `${opciones.nombre} ${opciones.apellido}`}
                placeholder= "Seleccione el cliente"
                noOptionsMessage= {() =>"No hay resultados"}
                isSearchable= {true}
            />
        </>
    );
}

export default AsignarCliente;