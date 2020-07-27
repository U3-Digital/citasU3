import React from 'react'

import { useRouter} from 'next/router'
import Swal from 'sweetalert2';


const HeaderUsuario = ({usuario}) =>{
    const router = useRouter();
    const {id,nombre,apellido,telefono,rol} = usuario

    

    const cerrarSesion = () =>{
        router.push('/controlpanel/login');
        localStorage.removeItem('token');
    } 

    return(

        <div className=" text-white py-2 px-2 mt-3 w-full bg-blue-900 rounded border-dashed">
            <p className="mr-2 mb-5 w-full font-semibold lg:mb-2">Hola: <span className="font-thin">
                {nombre} {apellido}</span>
            </p>
            <div className="flex">
                <button type="button" className="flex  w-full sm:w-auto font-bold rounded py-1 px-2 text-white  bg-gray-700" onClick={() =>editarCupon()}>
                    Editar
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"  className="w-6 h-6 ml-2" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button type="button" className=" flex  w-full sm:w-auto font-bold rounded py-1 px-2 text-white " onClick={() =>{
                    cerrarSesion()
                }} >
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                </button>
            </div>
            
        </div>

        
    );
}

export default HeaderUsuario;