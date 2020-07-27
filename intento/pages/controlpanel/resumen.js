import React from 'react'
import LayoutUsuarios from '../../components/panel/LayoutUsuarios';
import MejoresClientes from '../../components/panel/Resumenes/MejoresClientes';

  
const resumen = () =>{

    return (
        <LayoutUsuarios>
        <div>
          <MejoresClientes/>
        </div>
          
        </LayoutUsuarios>
      );
}

export default resumen;