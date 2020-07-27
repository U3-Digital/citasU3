import React from 'react'
import {gql, useQuery} from '@apollo/client';
import Producto from './Producto';

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos{
    obtenerProductos{
      id
      nombre
      precio
      existencia
    }
  }
`;


const TablaProductos = () =>{
    //consultar los preoductos
    const {data,loading,error} = useQuery(OBTENER_PRODUCTOS);
    if(loading) return 'cargando...';

    return(
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className= "bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Existencia</th>
              <th className="w-1/5 py-2">Precio</th>
              <th className="w-1/5 py-2">Eliminar</th>
              <th className="w-1/5 py-2">Editar</th>
              
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.obtenerProductos.map(producto =>(
              <Producto
                key={producto.id}
                producto={producto}
              />
            ))}
          </tbody>
        </table>
    );
}

export default TablaProductos;