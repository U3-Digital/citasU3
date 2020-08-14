import React, {useEffect} from 'react';
import {gql,useQuery,useMutation} from '@apollo/client';
import Cita from './Cita';
const OBTENER_CITAS = gql`
query obtenerPedidosFecha($fecha: String!){
    obtenerPedidosFecha(fecha: $fecha){
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
        cupon{
            nombre
            descuento
        }
        total
        fecha
        id
        estado 
    }
  }
`;

const TablaCitasEspecificas = ({fecha}) =>{
    if(fecha === null){
        return(
            <div className="flex justify-center py-2 ">
                <p className="mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">Selecciona una fecha a buscar</p>
            </div>
        );
    }
    const {data,loading,error,startPolling,stopPolling} = useQuery(OBTENER_CITAS,{
        variables:{
            fecha
        }
    });
    useEffect(() =>{
        startPolling(1000);
        return () =>{
            stopPolling();
        }
    },[startPolling, stopPolling]);


    if(loading) return null;

    if(data.obtenerPedidosFecha.length === 0){
        return(
            <div className="flex justify-center py-2 ">
                <p className="mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">No tienes citas En esta seccion</p>
            </div>
        );
    }


    console.log(data);
    return(
        <div className="md:grid md:grid-cols-3 md:gap-4">
            {data.obtenerPedidosFecha.map(cita=>(
                <Cita
                
                key = {cita.id}
                cita= {cita}
                />
            ))}
        </div>
    )
}

export default TablaCitasEspecificas;