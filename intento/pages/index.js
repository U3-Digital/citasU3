import Head from 'next/head'
import Layout from '../components/Layout'
import { gql,useQuery} from '@apollo/client';
import {useRouter} from 'next/router'
import Link from 'next/Link';
import TablaCitas from '../components/frontend/citas/TablaCitas';
import Select from 'react-select';
import React,{useState} from 'react'
import TablaEmpresas from '../components/frontend/empresas/TablaEmpresas';


         
         
         
        
const opciones = [
    { value: 'TODO', label: 'Todas' },
    {value: 'SEMANA', label: 'Esta Semana'},
    {value: 'MES', label: 'Este Mes'},
    {value: 'CANCELADO', label: 'Citas Canceladas'},
    {value: 'PASADO', label: 'Citas realizadas'}
]


export default function Index() {
  const [intervalo, setIntervalo] =useState({ value: 'TODO', label: 'Todas' });
  const [seleccion,setSeleccion] = useState(false);

  
 const CambiaOpcion = () =>{
    setSeleccion(true)
 }

 const muestraEmpresas = () =>{
     setSeleccion(false)
 }

  return (
    
    <div>
      <Layout>
            <div className="xl:flex justify-between">
                <div className="flex mt-2 xl:w-1/3 justify-center overflow-x-auto">
                    <button  className="bg-white w-1/2 ml-2 rounded text-xl font-black py-2" onClick={()=>CambiaOpcion()}>Mis citas</button>
                    <button  className="bg-white w-1/2 ml-2 mr-2 rounded text-xl font-black py-2" onClick={()=>muestraEmpresas()}>Agendar nueva cita</button>
                </div>
                <Select
                    id = 'filtro'
                    className="py-2 xl:mr-5 xl:w-1/3 xl:px-5 "
                    options={opciones}
                    hidden
                    noOptionsMessage= {() =>"No hay resultados"}
                    onChange= {selectedOption => {
                        //console.log(selectedOption.id);
                        setIntervalo(selectedOption);
                    }}
                    value={intervalo}
                />
            </div>
            {seleccion ?(
                <TablaCitas
                    filtro = {intervalo.value}
                />
            ):(<>
                <TablaEmpresas/>
                <div className="flex justify-center py-2 ">
                    <p className="mt-5 my-2 text-gray-200 p-2 text-sm font-bold ">Para registrarse en una nueva empresa, pide a un administrador que te registre</p>
                </div>
                </>
            )}
            
          
      </Layout>
    </div>
  )
}
