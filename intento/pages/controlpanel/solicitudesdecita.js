import React from 'react'
import LayoutUsuarios from '../../components/panel/LayoutUsuarios';
import TablaSolicitudes from '../../components/panel/citas/TablaSolicitudes';


const solicitudDeCita = () =>{
    return(
        <LayoutUsuarios>
            <h1 className="text-2xl text-gray-800 font-light">Mis Solicitudes de Citas</h1>
            <TablaSolicitudes/>
        </LayoutUsuarios>
    )
}

export default solicitudDeCita