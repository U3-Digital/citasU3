import React,{useState} from 'react'
import LayoutUsuarios from '../../components/panel/LayoutUsuarios';
import Link from 'next/link';
import TablaCitas from '../../components/panel/citas/TablaCitas'
import TablaCitasEspecificas from '../../components/panel/citas/TablaCitasEspecificas';
import Select from 'react-select';


         
         
         
        
const opciones = [
    { value: 'TODO', label: 'Este Día' },
    {value: 'SEMANA', label: 'Esta Semana'},
    {value: 'MES', label: 'Este Mes'},
    {value: 'PERSONALIZADO', label: 'Busqueda personalizada'},
    {value: 'CANCELADO', label: 'Citas Canceladas'},
    {value: 'PASADO', label: 'Citas realizadas'}
]

const citas = () =>{
    const [intervalo, setIntervalo] =useState({ value: 'TODO', label: 'Todas' });
    const [fechaEspecifica,setFechaEspecifica] = useState(null);
    const [visible,setvisible] = useState(true);
    return(
        <LayoutUsuarios>
            <div className="xl:flex justify-between">
                <h1 className="text-2xl text-gray-800 font-light">Mis citas</h1>
                    <input 
                        className="py-2 xl:ml-5 xl:w-1/3 xl:px-5 rounded"
                        id="fecha"
                        hidden = {visible}
                        type= "date"
                        onChange={fechaSeleccionada =>{
                            setFechaEspecifica(fechaSeleccionada.target.value);
                        }}
                        
                    />
                    <Select
                        id = 'filtro'
                        className="py-2 xl:ml-5 xl:w-1/3 xl:px-5 "
                        options={opciones}
                        noOptionsMessage= {() =>"No hay resultados"}
                        onChange= {selectedOption => {
                            //console.log(selectedOption.id);
                            setIntervalo(selectedOption);
                            if(selectedOption.value === "PERSONALIZADO"){
                                setvisible(false);
                            }else{
                                setvisible(true);
                            }
                        }}
                        value={intervalo}
                    />
            </div>
            

            <Link href="nuevacita">
                <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded  text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nueva Cita</a>
            </Link>
            {intervalo.value === 'PERSONALIZADO' ? (
                <TablaCitasEspecificas
                    fecha= {fechaEspecifica}
                />
            ):(
                <TablaCitas
                    filtro = {intervalo.value}
                />
            )}
            
        </LayoutUsuarios>
    )
}
export default citas;