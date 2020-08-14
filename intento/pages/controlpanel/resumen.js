import React,{useState} from 'react'
import LayoutUsuarios from '../../components/panel/LayoutUsuarios';
import Select from 'react-select';

import TablaResumenes from '../../components/panel/Resumenes/TablaResumen';
  
const opciones = [
  {value: 'DIA', label: 'Resumen Diario'},
  {value: 'SEMANA', label: 'Resumen Semanal'},
  {value: 'MES', label: 'Resumen Mensual'}
  
]


const resumen = () =>{
  const [intervalo, setIntervalo] =useState({value: 'DIA', label: 'Resumen Diario'});
    return (
        <LayoutUsuarios>
          <div className="xl:flex justify-between">
            <h1 className="text-2xl text-gray-800 font-light">Resumen de ingresos</h1>
                <Select
                    id = 'filtros'
                    className="py-2 xl:ml-5 xl:w-1/3 xl:px-5 "
                    options={opciones}
                    noOptionsMessage= {() =>"No hay resultados"}
                    onChange= {selectedOption => {
                        //console.log(selectedOption.id);
                        setIntervalo(selectedOption);
                    }}
                    value={intervalo}
                />
          </div>
          
          <TablaResumenes
            filtro = {intervalo.value}
          />
        </LayoutUsuarios>
      );
}
//https://www.tailwindtoolbox.com/templates/admin-template
export default resumen;