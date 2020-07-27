import React from 'react'
import LayoutAdmin from '../../components/admin/LayoutAdmin';
import FormNuevoUsuario from '../../components/admin/productos/FormNuevoProducto';
const NuevoProducto = () =>{
    return(
        <LayoutAdmin>
            <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
            <div className="flex justify-center mt-5 ">
                <div className="w-full max-w-4xl "> 
                    <FormNuevoUsuario/>
                </div>
            </div>
        </LayoutAdmin>
    );
}
export default NuevoProducto;