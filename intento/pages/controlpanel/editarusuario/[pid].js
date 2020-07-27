import React from './node_modules/react'
import LayoutUsuarios from '../../../components/panel/LayoutUsuarios';
import {useRouter} from 'next/router';

const editarUsuario = () =>{
    //obtener el id actual
    const router = useRouter();
    const { query: {id}} = router;

    return(
        <LayoutUsuarios>
            <h1 className="text-2xl text-gray-800 font-light">Actualizar Usuario</h1>
        </LayoutUsuarios>
    )
}

export default editarUsuario;