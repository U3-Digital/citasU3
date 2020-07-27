import React,{useEffect, useState,useContext} from 'react';
import Select from 'react-select';
const OBTENER_PRODUCTOS = gql`
  query obtenerProductosEmpresa{
    obtenerProductosEmpresa{
      id
      nombre
      precio
    }
  }
`;
import {gql,useQuery} from '@apollo/client';
import PedidoContext from '../../../../context/pedidos/PedidoContext';

const AsignarServicios = () =>{
    //STATE LOCAL DEL COMPONENTE
    const [productos,setProductos] = useState([]);

    //context de pedidos
    const pedidocontext = useContext(PedidoContext);
    const {agregarProducto,productos: productosState} = pedidocontext;

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
        <Select
            className="mt-3 xl:ml-3 w-full" 
            options={obtenerProductosEmpresa}
            isMulti ="true"
            onChange ={(opcion) =>seleccionarProducto(opcion)}
            getOptionValue={opciones => opciones.id}
            getOptionLabel={opciones => opciones.nombre}
            placeholder= "Seleccione el producto"
            noOptionsMessage= {() =>"No hay resultados"}
            value= {productosState}
        />
    )
}

export default AsignarServicios;

