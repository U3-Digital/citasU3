import React from 'react'
import ProximaCita from './ProximaCita';
import {useQuery, gql} from '@apollo/client';

const OBTENER_PROXIMAS_CITAS = gql`
    query obtenerProximasCitas($id: ID!){
        obtenerProximasCitas(id: $id){
            id
            pedido{
                id
                nombre
                precio
            }
            total
            cliente{
                id
                nombre
                apellido
                email
                telefono
            }
            empresa
            fecha
            estado
        }
    }
`;

const TablaProximaCita = ({id}) =>{
    const {data,loading,error} = useQuery(OBTENER_PROXIMAS_CITAS,{
        variables:{
            id
        }
    });

    if(loading) return('Cargando...');
    

    if(data.obtenerProximasCitas.length === 0){
        return(
            <div className=" py-2 ">
                <h1 className="text-xl text-black font-mono">Próximas Citas: </h1>
                <p className="mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">No tiene citas proximas</p>
            </div>
        );
    }
    return(
        <div className="overflow-y-auto h-64">
            <h1 className="text-xl text-black font-mono">Próximas Citas: </h1>
            {data.obtenerProximasCitas.map(cita=>(
                <ProximaCita
                    key = {cita.id}
                    cita= {cita}
                />
            ))}
        </div>
    )
}

export default TablaProximaCita;