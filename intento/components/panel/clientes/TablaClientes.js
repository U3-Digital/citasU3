import React,{useEffect} from 'react'
import { gql,useQuery,useMutation} from '@apollo/client';
import Cliente from './Cliente';

const OBTENER_CLIENTES = gql `
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


const TablaClientes = () =>{

    //consulta de apollo 
    const {data, loading , error,startPolling,stopPolling} = useQuery(OBTENER_CLIENTES);

    useEffect(() =>{
        startPolling(1000);
        return () =>{
            stopPolling();
        }
    },[startPolling, stopPolling])

    if(loading){
        return'Cargando';
    }

    if(data.obtenerClientesEmpresa.length === 0){
        return(
            <div className="flex justify-center py-2 ">
                <p className="mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">Aún no tienes clientes registrados</p>
            </div>
        );
    }

   /* const {obtenerClientesEmpresa} = data;
    obtenerClientesEmpresa.filter(cliente => cliente.status === "HABILITADO").map(
        nombrefiltrado=>(
            console.log(nombrefiltrado)
        
    ))*/

    

    return(
        <div className="md:grid md:grid-cols-3 md:gap-4">
            {data.obtenerClientesEmpresa.map(cliente =>(
                <Cliente
                key={cliente.id}
                cliente={cliente}
                />
            ))}
        </div>
        
    )
}

export default TablaClientes;