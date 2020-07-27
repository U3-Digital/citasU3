import React,{useEffect, useState,useContext} from 'react';
import Select from 'react-select';
import {gql,useQuery} from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTOS = gql`
  query obtenerProductosEmpresa{
    obtenerProductosEmpresa{
      id
      nombre
      precio
    }
  }
`;

const AsignarProductos = () =>{
    //STATE LOCAL DEL COMPONENTE
    const [productos,setProductos] = useState([]);

    //context de pedidos
    const pedidocontext = useContext(PedidoContext);
    const {agregarProducto} = pedidocontext;

    const {data,loading,error} = useQuery(OBTENER_PRODUCTOS);
    
    useEffect(() =>{
        //TODO: Funcion para pasar a pedido state
        agregarProducto(productos);
    },[productos])
    const seleccionarProducto = producto =>{
        setProductos(producto)
    }
    if(loading) return null;

    const {obtenerProductosEmpresa} = data;



    return(
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold ">5.- Selecciona o busca los productos</p>
            <Select
                className="mt-3" 
                options={obtenerProductosEmpresa}
                isMulti ="true"
                onChange ={(opcion) =>seleccionarProducto(opcion)}
                getOptionValue={opciones => opciones.id}
                getOptionLabel={opciones => opciones.nombre}
                placeholder= "Seleccione el producto"
                noOptionsMessage= {() =>"No hay resultados"}
            />
        </>
    )
}

export default AsignarProductos;
