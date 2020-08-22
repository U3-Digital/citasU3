import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useRouter} from 'next/router'
import Swal from 'sweetalert2';
const OBTENER_USUARIO = gql`
    query obtenerUsuario{
        obtenerUsuario{
            id
            nombre
            apellido
            telefono
            rol
        }
    }
`;

const HeaderAdmin = () =>{


    const router = useRouter();
    //query de apollo 
    const {data,loading, error} = useQuery(OBTENER_USUARIO);



    //proteger que no accedamos a data antes de tener resultados
    if(loading) return null;

    //si no hay información


    //console.log(data);
    if(!data.obtenerUsuario){
        router.push('/4dm1n/login');
        return null;
    }
    console.log(data.obtenerUsuario);
    const{nombre, apellido,rol} = data.obtenerUsuario;
    if(rol !== 'SUPERADMINISTRADOR'){ 
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No cuentas con las creedenciales para acceder a esta pagina'
          })
          setTimeout(() => {
            localStorage.removeItem('token');
            return( 
                
                router.push('/4dm1n/login')
                );
          }, 200);
    
    }

    const cerrarSesion = () =>{
        localStorage.removeItem('token');
        router.push('/4dm1n/login')
    } 

    return(

        <div className=" flex text-white py-2 px-2 w-full bg-blue-900 rounded ">
            <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="h-10 w-10 mt-2" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <div>
                <p className="mr-2 mb-5 lg:mb-2">Hola: {nombre} {apellido}</p>

                <button type="button" className=" flex bg-yellow-500 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md" onClick={() =>{
                    cerrarSesion()
                }} >
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                    Cerrar Sesión
                </button>
            </div>
            
        </div>

        
    );
}

export default HeaderAdmin;