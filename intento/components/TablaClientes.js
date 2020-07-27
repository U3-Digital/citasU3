import React from 'react'
import Cliente from '../components/Cliente'
import { gql,useQuery} from '@apollo/client';
import {useRouter} from 'next/router'
import Link from 'next/Link';

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor{
    obtenerClientesVendedor{
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;


const TablaClientes = () =>{
    const router = useRouter();
    
    //consulta de apollo 
    const {data, loading , error} = useQuery(OBTENER_CLIENTES_USUARIO);

    //console.log(data);

    if(loading){
        return'Cargando';
    }
    
    if(!data.obtenerClientesVendedor){
        return router.push('/login');
    }

    return(
        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className= "bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Nombre</th>
                <th className="w-1/5 py-2">Empresa</th>
                <th className="w-1/5 py-2">email</th>
                <th className="w-1/5 py-2">Eliminar</th>
                <th className="w-1/5 py-2">Editar</th>
                
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.obtenerClientesVendedor.map(cliente =>(
                <Cliente
                  key={cliente.id}
                  cliente={cliente}
                />
              ))}
            </tbody>
          </table>
        </div>
    );
}

export default TablaClientes;