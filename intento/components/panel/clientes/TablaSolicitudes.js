import React,{useEffect} from 'react'
import { gql,useQuery} from '@apollo/client';
import SolicitudCliente from './SolicitudCliente';
const OBTENER_SOLICITUDES = gql`
    query obtenerClientesPendientesEmpresa{
        obtenerClientesPendientesEmpresa{
            id
            nombre
            apellido
            email
            telefono
            status
            empresa{
            id
            nombre
            }
        }
    }
`;

const TablaSolicitudes = () =>{


    const {data,loading,error,startPolling,stopPolling} = useQuery(OBTENER_SOLICITUDES);

    useEffect(() =>{
        startPolling(1000);
        return () =>{
            stopPolling();
        }
    },[startPolling, stopPolling])

    if(loading) return('cargando...');

    if(data.obtenerClientesPendientesEmpresa.length ===0){
        return(
            <div className="flex justify-center py-2 ">
                <p className="mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">No hay solicitudes pendientes</p>
            </div>
        );
    }
    
    //console.log(data);

    return(
        <>
        <div className="flex">
            <p className="xl:mt-5 my-2 text-gray-700 p-2 text-sm font-bold  ">Solicitudes Pendientes:</p>
            <p className="xl:mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">{data.obtenerClientesPendientesEmpresa.length}</p>
        </div>
        <div className="md:grid md:grid-cols-3 md:gap-4">
            {data.obtenerClientesPendientesEmpresa.map(cliente =>(
                <SolicitudCliente
                key={cliente.id}
                cliente={cliente}
                />
            ))}
        </div>
        </>
    )
}

export default TablaSolicitudes;