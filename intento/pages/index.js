import Head from 'next/head'
import Layout from '../components/Layout'
import { gql,useQuery} from '@apollo/client';
import {useRouter} from 'next/router'
import Link from 'next/Link';
import TablaCitas from '../components/frontend/citas/TablaCitas';
import Select from 'react-select';
import React,{useState} from 'react'


         
         
         
        
const opciones = [
    { value: 'TODO', label: 'Todas' },
    {value: 'SEMANA', label: 'Esta Semana'},
    {value: 'MES', label: 'Este Mes'},
    {value: 'CANCELADO', label: 'Citas Canceladas'},
    {value: 'PASADO', label: 'Citas realizadas'}
]


export default function Index() {
  const [intervalo, setIntervalo] =useState({ value: 'TODO', label: 'Todas' });
  
  return (
    
    <div>
      <Layout>
        <div className="xl:flex justify-between">
          <h1 className="text-2xl text-gray-800 font-light">Mis citas</h1>
              <Select
                id = 'filtro'
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
        <Link href="nuevacita">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded  text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nueva Cita</a>
        </Link>
        <TablaCitas
          filtro = {intervalo.value}
        />
      </Layout>
    </div>
  )
}
