import React from 'react'
import {useRouter} from 'next/router';
import LayoutUsuario from '../../../components/panel/LayoutUsuarios';
import FormEditProducto from '../../../components/panel/productos/FormEditProducto';

const editarProducto= () =>{
    //obtener el id actual
    const router = useRouter();
    const { query: {id}} = router;

    return(
        <LayoutUsuario>
            <h1 className="text-2xl text-gray-800 font-light">Actualizar Cliente</h1>
            <div className="flex justify-center mt-5 ">
                <div className="w-full max-w-lg ">
                    <FormEditProducto
                        key = {id}
                        id = {id}
                    />
                </div>
            </div>
        </LayoutUsuario>
            
    )    
}
export default editarProducto;