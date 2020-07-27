import React from 'react'
import LayoutUsuarios from '../../components/panel/LayoutUsuarios'
import InfoEmpresa from '../../components/panel/InfoEmpresa';
const Index = () =>{
    return(
        <LayoutUsuarios>
            <h1 className="text-2xl text-gray-800 font-light">Bienvenido a U3Citas</h1>
            <p className="mt-0 my-1 text-gray-700 p-2 text-sm font-bold ">Tu sitio de citas en internet</p>
            <InfoEmpresa/>    
        </LayoutUsuarios>
    );
}

export default Index;