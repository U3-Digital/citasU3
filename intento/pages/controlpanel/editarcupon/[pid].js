import React from 'react'
import LayoutUsuarios from '../../../components/panel/LayoutUsuarios';
import FormEditaCupon from '../../../components/panel/cupones/FormEditaCupon';
import {useRouter} from 'next/router';
const editarCupon = () =>{

    const router = useRouter();
    const { query: {id}} = router;
    return(
        <LayoutUsuarios>
            <h1 className="text-2xl text-gray-800 font-light">Editar Cupon</h1>

        <div className="flex justify-center mt-5 ">
            <div className="w-full max-w-lg ">
                <FormEditaCupon
                    key = {id}
                    id = {id}
                />
            </div>
        </div>
        </LayoutUsuarios>
    )
}
export default editarCupon;