import React from 'react'
import {useRouter} from 'next/router';
import LayoutAdmin from '../../../components/admin/LayoutAdmin';
import FormEditProducto from '../../../components/admin/productos/FormEditProducto';

const editarProducto= () =>{
    //obtener el id actual
    const router = useRouter();
    const { query: {id}} = router;

    return(
        <LayoutAdmin>
            <h1 className="text-2xl text-gray-800 font-light">Actualizar Producto</h1>
            <div className="flex justify-center mt-5 ">
                <div className="w-full max-w-lg ">
                    <FormEditProducto
                        key = {id}
                        id = {id}
                    />
                </div>
            </div>
        </LayoutAdmin>
            
    )    
}
export default editarProducto;