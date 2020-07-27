import React from 'react'
import LayoutUsuarios from '../../../components/panel/LayoutUsuarios'
import {useRouter} from 'next/router';
import FormCompletar from '../../../components/panel/citas/FormCompletar';
const completarCitar = () =>{
    //obtener el id actual
    const router = useRouter();
    const { query: {id}} = router;
    
    return(
        <LayoutUsuarios>
            <h1 className="text-2xl text-gray-800 font-light">Completar cita </h1>
            <FormCompletar
                key = {id}
                id = {id}
            />
        </LayoutUsuarios>
    )
}

export default completarCitar;