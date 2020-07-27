import React from 'react'
import { gql,useQuery} from '@apollo/client';
import Empresa from './Empresa';
const OBTENER_EMPRESAS = gql `
    query obtenerEmpresas{
        obtenerEmpresas{
            id
            nombre
            direccion
            fotos
            
        }
    }
`;

const TablaEmpresas = () =>{

    //consulta de apollo 
    const {data, loading , error} = useQuery(OBTENER_EMPRESAS);

    if(loading){
        return'Cargando';
    }
    //console.log(data);

    return(
        
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className= "bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Foto</th>
                <th className="w-1/5 py-2">nombre</th>
                <th className="w-1/5 py-2">Direccion</th>
                <th className="w-1/5 py-2">Eliminar</th>
                <th className="w-1/5 py-2">Editar</th>
                
              </tr>
            </thead>
            <tbody className="bg-white">
                {data.obtenerEmpresas.map(empresa =>(
                    <Empresa
                    key={empresa.id}
                    empresa={empresa}
                    />
                ))}              
            </tbody>
          </table>
        
    );
}

export default TablaEmpresas;