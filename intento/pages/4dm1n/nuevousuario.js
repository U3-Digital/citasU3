import React from 'react'
import LayoutAdmin from '../../components/admin/LayoutAdmin';

import FormNuevoUsuario from '../../components/admin/usuarios/FormNuevoUsuario';



const NuevoUsuario = () =>{
    
    

    return(
        
        <LayoutAdmin>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Usuario</h1>

            <div className="flex justify-center mt-5 ">
                <div className="w-full max-w-4xl "> 
                    <FormNuevoUsuario/>  
                </div>
            </div>

        </LayoutAdmin>
    )
}

export default NuevoUsuario;