import React,{useEffect,useState} from 'react'
import { gql,useQuery} from '@apollo/client';
import Cita from './Cita';
const OBTENER_CITAS = gql`
    query obtenerCitasCliente($intervalo: Intervalo!){
        obtenerCitasCliente(intervalo: $intervalo){
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
            }
            id
            total
            fecha
            estado
            cupon{
                nombre
                descuento
            }
        }
    }
`;
const TablaCitas =({filtro}) =>{

    const {data,loading,error,startPolling,stopPolling} = useQuery(OBTENER_CITAS,{
        variables:{
            intervalo: filtro
        }
    });

    

    useEffect(() =>{
        startPolling(1000);
        return () =>{
            stopPolling();
        }
    },[startPolling, stopPolling])

    if(loading) return('Cargando...');



    if(data.obtenerCitasCliente.length === 0){
        return(
            <div className="flex justify-center py-2 ">
                <p className="mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">No tienes citas En esta seccion</p>
            </div>
        );
    }

    return(
        <div className="md:grid md:grid-cols-3 md:gap-4">
            {data.obtenerCitasCliente.map(cita=>(
                <Cita
                
                key = {cita.id}
                cita= {cita}
                />
            ))}
        </div>
    )
}

export default TablaCitas;