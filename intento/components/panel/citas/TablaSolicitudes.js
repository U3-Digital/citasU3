import React,{useEffect,useState} from 'react'
import { gql,useQuery} from '@apollo/client';
import SolicitudCita from './SolicitudCita';

const OBTENER_SOLICITUDES_CITAS = gql`
    query obtenerSolicitudesPedidos{
        obtenerSolicitudesPedidos{
        id
        pedido{
            id
            nombre
            precio
        }
        cliente{
            id
            nombre
            apellido
            email
            telefono
            
        }
        total
        fecha
        estado
        empresa   
        } 
    }
`;

const TablaSolicitudes = () =>{
    const {data,loading,error,startPolling,stopPolling} = useQuery(OBTENER_SOLICITUDES_CITAS);
    
    useEffect(() =>{
        startPolling(500);
        return () =>{
            stopPolling();
        }
    },[startPolling, stopPolling])

    if(loading) return('Cargando...');

    //console.log(data);

    if(data.obtenerSolicitudesPedidos.length === 0){
        return(
            <div className="flex justify-center py-2 ">
                <p className="mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">No tienes solicitudes pendientes</p>
            </div>
        );
    }

    return(
        <>
            <div className="flex">
                <p className="xl:mt-5 my-2 text-gray-700 p-2 text-sm font-bold  ">Solicitudes Pendientes:</p>
                <p className="xl:mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">{data.obtenerSolicitudesPedidos.length}</p>
            </div>
            <div className="md:grid md:grid-cols-3 md:gap-4">
                {data.obtenerSolicitudesPedidos.map(cita=>(
                    <SolicitudCita
                        key = {cita.id}
                        cita= {cita}
                    />
                ))}
            </div>
        </>
    )

}

export default TablaSolicitudes;