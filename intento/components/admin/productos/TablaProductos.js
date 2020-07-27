import React from 'react'
import {gql,useQuery} from '@apollo/client';
import Producto from './Producto';
const OBTENER_PRODUCTOS= gql`
    query obtenerProductos($id: ID!){
        obtenerProductos(id: $id){
            id
            nombre
            precio
            empresa
        }
    }
`;

const TablaProductos =({empresa}) =>{
    
    if(!empresa){
        return(
            <div className="flex justify-center py-2 ">
                <p className="mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">Aún no haz seleccionado alguna empresa</p>
            </div>
            
        )
    }
    const {id, nombre, direccion} = empresa;
    const {data,loading,error} = useQuery(OBTENER_PRODUCTOS, {
        variables: {
            id
        }
    });
    
    if(loading) return 'Cargando...';
    //console.log(data);
    return(
        <>
        {data.obtenerProductos.length !== 0 ? (
            <>
            <div className="xl:flex xl:justify-between">
                <div className="flex">
                    <p className="xl:mt-5 my-2 text-gray-700 p-2 text-sm font-bold  ">Empresa:</p>
                    <p className="xl:mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">{nombre}</p>
                </div>
                <div className="flex">
                    <p className="xl:mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">Dirección:</p>
                    <p className="xl:mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">{direccion}</p>
                </div>
            </div>
            <div className="overflow-x-scroll">
                <table className="table-auto shadow-md mt-10 w-full w-lg">
                <thead className= "bg-gray-800">
                <tr className="text-white">
                    <th className="w-1/5 py-2">Nombre</th>
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
            </div>
            </>
        ) : (
            <div className="flex justify-center py-2 ">
                <p className="mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">La empresa no cuenta con productos registrados</p>
            </div>       
        )

        }
            
        </>
    )
}

export default TablaProductos;