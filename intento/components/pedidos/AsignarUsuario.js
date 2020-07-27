import React,{useState,useEffect, useContext} from 'react'
import Select from 'react-select';
import {gql, useQuery} from '@apollo/client'
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_USUARIOS = gql`
    query obtenerUsuarios{
        obtenerUsuarios{
            nombre
            apellido
            id
            email
            telefono
            status
            rol
        }
    }
`

const AsignarUsuario = () =>{

    const [usuario, setUsuario] = useState([]);

    //context de pedidos
    const pedidocontext = useContext(PedidoContext);
    const {agregarUsuario} = pedidocontext;
    //consultar la BD
    const {data,loading,error} = useQuery(OBTENER_USUARIOS);

    useEffect(() =>{
        agregarUsuario(usuario);
    },[usuario])

    const seleccionaUsuario = usuarios =>{
        setUsuario(usuarios);
    }

    if(loading) return(null);
    const {obtenerUsuarios} = data;
    return(
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold ">2.- Asigna un Usuario a la cita</p>
            <Select
                className="mt-3" 
                options={obtenerUsuarios}
                onChange ={(opcion) =>seleccionaUsuario(opcion)}
                getOptionValue={opciones => opciones.id}
                getOptionLabel={opciones => `${opciones.nombre} ${opciones.apellido}`}
                placeholder= "Seleccione el Usuario"
                noOptionsMessage= {() =>"No hay resultados"}
            />
        </>
    )
}

export default AsignarUsuario;