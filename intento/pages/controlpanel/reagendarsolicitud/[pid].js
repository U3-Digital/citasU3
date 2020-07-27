import React from 'react'
import LayoutUsuarios from '../../../components/panel/LayoutUsuarios'
import {useRouter} from 'next/router';
import EditarSolicitud from '../../../components/panel/citas/editarSolicitud'

const reagendarSolicitud = () =>{
     //obtener el id actual
    const router = useRouter();
    const { query: {id}} = router;
    return(
        <LayoutUsuarios>
            <h1 className="text-2xl text-gray-800 font-light">Reagendar cita </h1>
            <EditarSolicitud
            key = {id}
            id = {id}
            />
        </LayoutUsuarios>
    )
}   

export default reagendarSolicitud;