import React from 'react'
import LayoutUsuarios from '../../components/panel/LayoutUsuarios'
import TablaSolicitudes from '../../components/panel/clientes/TablaSolicitudes';

const solicitudesClientes = () =>{
    return(
        <LayoutUsuarios>
            <h1 className="text-2xl text-gray-800 font-light">Solicitudes de Clientes</h1>
            <TablaSolicitudes/>
        </LayoutUsuarios>
    );
}

export default solicitudesClientes;