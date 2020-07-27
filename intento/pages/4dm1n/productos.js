import React,{useState} from 'react'
import LayoutAdmin from '../../components/admin/LayoutAdmin';
import Link from 'next/link';
import Select from 'react-select';
import {gql, useMutation, useQuery} from '@apollo/client';
import TablaProductos from '../../components/admin/productos/TablaProductos';
const OBTENER_EMPRESAS = gql`
    query obtenerEmpresas{
        obtenerEmpresas{
            id
            nombre
            direccion
            fotos
        }
    }
`;


const Productos = () =>{
    const [empresa,setEmpresa] = useState(null);
    const {data,loading,error} = useQuery(OBTENER_EMPRESAS);
    if(loading) return 'Cargando...';
    const {obtenerEmpresas} =data;


    return(
        <LayoutAdmin>
            <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
            <div className="xl:flex">
                <div className="xl:w-1/2 sm:w-1/3">
                    <Link href="nuevoproducto">
                        <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded  text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nuevo Producto</a>
                    </Link>
                </div>
                <div className="xl:w-1/2 sm:w-full">
                    <Select
                        className="py-2 xl:ml-5 w-full xl:px-5 "
                        id="empresa"
                        options={obtenerEmpresas}
                        placeholder="Seleccione una empresa"
                        getOptionValue={opciones => opciones.id}
                        getOptionLabel={opciones => opciones.nombre}
                        noOptionsMessage= {() =>"No hay resultados"}
                        onChange= {selectedOption => {
                            //console.log(selectedOption.id);
                            setEmpresa(selectedOption);
                        }}
                    />
                </div>
            </div>
            <TablaProductos
                empresa={empresa}
            />                 
        </LayoutAdmin>
    )
}

export default Productos;