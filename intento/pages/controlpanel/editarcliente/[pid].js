import React from 'react'
import LayoutUsuarios from '../../../components/panel/LayoutUsuarios'
import FormEditaCliente from '../../../components/panel/clientes/FormEditaCliente';
import {useRouter} from 'next/router';
const editacliente = () =>{
    //obtener el id actual
    const router = useRouter();
    const { query: {id}} = router;

    return(
        <LayoutUsuarios>
            <h1 className="text-2xl text-gray-800 font-light">Actualizar Cliente</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-4xl">
                    <FormEditaCliente
                        key ={id}
                        id = {id}
                    />
                </div>
            </div>
            
        </LayoutUsuarios>
    );
}

export default editacliente;