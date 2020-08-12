import React from 'react'
import LayoutUsuarios from '../../components/panel/LayoutUsuarios';
import MejoresClientes from '../../components/panel/Resumenes/MejoresClientes';

  
const resumen = () =>{

    return (
        <LayoutUsuarios>
        <div>
          <div class="bg-green-100 border-b-4 border-green-600 rounded-lg shadow-lg p-5">
                        <div class="flex flex-row items-center">
                            <div class="flex-shrink pr-4">
                                <div class="rounded-full p-5 bg-green-600"><i class="fa fa-wallet fa-2x fa-inverse"></i></div>
                            </div>
                            <div class="flex-1 text-right md:text-center">
                                <h5 class="font-bold uppercase text-gray-600">Total Revenue</h5>
                                <h3 class="font-bold text-3xl">$3249 <span class="text-green-500"><i class="fas fa-caret-up"></i></span></h3>
                            </div>
                        </div>
                    </div>

          <MejoresClientes/>
        </div>
          
        </LayoutUsuarios>
      );
}
//https://www.tailwindtoolbox.com/templates/admin-template
export default resumen;