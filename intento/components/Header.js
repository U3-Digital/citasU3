import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useRouter} from 'next/router'
const OBTENER_USUARIO = gql`
    query obtenerUsuario{
        obtenerUsuario{
            id
            nombre
            apellido
            telefono
            email
        }
    }
`;

const Header = () =>{


    const router = useRouter();
    //query de apollo 
    const {data,loading, error} = useQuery(OBTENER_USUARIO);



    //proteger que no accedamos a data antes de tener resultados
    if(loading) return null;

    //si no hay información


    console.log(data);
    if(!data.obtenerUsuario){
        return router.push('/login');
    }
    const{nombre, apellido} = data.obtenerUsuario;

    const cerrarSesion = () =>{
        localStorage.removeItem('token');
        router.push('/login')
    } 

    return(

        <div className=" mt-2 mb-2 flex  text-white py-2 px-2 w-full justify-end">
            <p className="mr-2 xl:mt-2 lg:mb-2">Hola: {nombre} {apellido}</p>
            <button type="button"  onClick={() =>{
                    cerrarSesion()
                }} >
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                    
            </button>
            
            
        </div>

        
    );
}

export default Header;