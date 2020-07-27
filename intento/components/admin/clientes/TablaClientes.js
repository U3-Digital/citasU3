import React from 'react'
import { gql,useQuery} from '@apollo/client';
import Cliente from './Cliente';

const OBTENER_CLIENTES = gql `
    query obtenerClientes{
        obtenerClientes{
            id
            nombre
            apellido
            email
            empresa{
                nombre
            }
        }
    }
`;


const TablaClientes = () =>{

    //consulta de apollo 
    const {data, loading , error} = useQuery(OBTENER_CLIENTES);
    if(loading){
        return'Cargando';
    }
   


    return(
        <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className= "bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Nombre</th>
                <th className="w-1/5 py-2">Email</th>
                <th className="w-1/5 py-2">Empresa</th>
                <th className="w-1/5 py-2">Eliminar</th>
                <th className="w-1/5 py-2">Editar</th>
                
              </tr>
            </thead>
            <tbody className="bg-white">
                {data.obtenerClientes.map(cliente =>(
                    <Cliente
                    key={cliente.id}
                    cliente={cliente}
                    />
                ))}              
            </tbody>
          </table>
    )
}

export default TablaClientes;