import React from 'react'
import {useQuery,gql} from '@apollo/client';

const OBTENER_MI_EMPRESA = gql`
    query obtenerMiEmpresa{
        obtenerMiEmpresa{
            id
            nombre
            direccion
            email
            facebook
            instagram
            whatsapp
            fotos
        }
    }
`;
const InfoEmpresa = () =>{

    const {data,loading,error} = useQuery(OBTENER_MI_EMPRESA);
    
    if(loading) return null;

    if(!data) return null;


    const {id,nombre,direccion,email,facebook,instagram,whatsapp,fotos} = data.obtenerMiEmpresa;


    return(
        <div className="w-full max-w-xl e bg-white shadow-md px-4 pt-6 pb-8 mb-4">
            <div className="flex">
                <div>
                    <img src="https://u3digital.com.mx/wp-content/uploads/2020/06/u3-1536x1536.png"
                    className="justify center w-32 h-32 rounded-full" id="imgfoto"></img>
                </div>
                <div>
                    <h1 className=" ml-2 text-2xl text-black font-mono">{nombre}</h1>
                    <p className=" ml-2 flex text-lg items-center my-2 font-mono text-gray-800 ">
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 mr-2" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {direccion}
                    </p> 
                    
                </div> 
            </div>
            <p className=" mt-8 ml-2 flex text-sm items-center my-2  w-full font-mono text-gray-800 ">
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 mr-2" stroke="currentColor"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
                    {`http://localhost:3000/login/[id]?id=${id}`}
            </p> 
            
            
             
        </div> 
    )
}
export default InfoEmpresa;