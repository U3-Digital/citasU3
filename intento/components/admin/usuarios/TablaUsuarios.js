import React from 'react'
import { gql,useQuery} from '@apollo/client';
import Usuario from './Usuario';
const OBTENER_USUARIOS = gql `
    query obtenerUsuarios{
        obtenerUsuarios{
            id
            nombre
            apellido
            id
            email
            telefono
            status
            rol
        }
    }

`;

const TablaUsuarios = () =>{

    //consulta de apollo 
    const {data, loading , error} = useQuery(OBTENER_USUARIOS);

    if(loading){
        return'Cargando';
    }
    console.log(data);

    return(
        
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className= "bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Nombre</th>
                <th className="w-1/5 py-2">Email</th>
                <th className="w-1/5 py-2">Rol</th>
                <th className="w-1/5 py-2">Eliminar</th>
                <th className="w-1/5 py-2">Editar</th>
                
              </tr>
            </thead>
            <tbody className="bg-white">
                {data.obtenerUsuarios.map(usuario =>(
                    <Usuario
                    key={usuario.id}
                    usuario={usuario}
                    />
                ))}              
            </tbody>
          </table>
        
    );
}

export default TablaUsuarios;