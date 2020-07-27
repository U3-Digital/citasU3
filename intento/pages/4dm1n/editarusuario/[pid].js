import React from 'react'
import LayoutUsuario from '../../../components/admin/LayoutAdmin';
import {useRouter} from 'next/router';
import FormEditaUsuario from '../../../components/admin/usuarios/FormEditaUsuario';




const EditarUsuario = () =>{
    //obtener el id actual
    const router = useRouter();
    const { query: {id}} = router;

    

    return(
        <LayoutUsuario>
            <h1 className="text-2xl text-gray-800 font-light">Edita Usuario</h1>
            <div className="flex justify-center mt-5 ">
                <div className="w-full max-w-4xl "> 
                    <FormEditaUsuario
                        key ={id}
                        id = {id}
                    />  
                </div>
            </div>
            
        </LayoutUsuario>
    )
}

export default EditarUsuario;