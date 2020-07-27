import React from 'react'
import LayoutAdmin from '../../../components/admin/LayoutAdmin';
import {useRouter} from 'next/router'
import FormEditaCliente from '../../../components/admin/clientes/FormEditaCliente';



const editarCliente = () =>{

    const router = useRouter();
    const {query: {id}} = router;

    


    return(
        <LayoutAdmin>
            <h1 className="text-2xl text-gray-800 font-light">Actualizar Cliente</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-4xl">
                    <FormEditaCliente
                        key = {id}
                        id = {id}
                    />
                </div>
            </div> 
        </LayoutAdmin>
    )
}
export default editarCliente;