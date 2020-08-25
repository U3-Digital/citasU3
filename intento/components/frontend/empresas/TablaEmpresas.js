import React from 'react'
import {gql,useQuery} from '@apollo/client';
import Empresa from './Empresa';
const OBTENER_EMPRESAS =gql`
    query obtenerMisEmpresas{
        obtenerMisEmpresas{
            empresa{
                id
                nombre
                direccion
                email
            }
        }
    }
`;


const TablaEmpresas = () =>{

    const {data,loading,error} = useQuery(OBTENER_EMPRESAS);

    if(loading) return(
        <div className="flex justify-center py-2 ">
            <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
            <p className="mt-5 my-2 text-gray-200 p-2 text-sm font-bold ">Cargando</p>
        </div>
        

    );

    console.log(data.obtenerMisEmpresas);
    return(
        <div className="md:grid md:grid-cols-3 md:gap-4 px-2 mr-3">
            {data.obtenerMisEmpresas.empresa.map(empresa=>(
                <Empresa
                
                key = {empresa.id}
                empresa= {empresa}
                />
            ))}
        </div>
    );
}

export default TablaEmpresas;