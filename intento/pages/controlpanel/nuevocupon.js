import React from 'react'
import LayouUsuarios from '../../components/panel/LayoutUsuarios'
import {useFormik, useField} from 'formik';
import * as Yup from 'yup';
import {gql, useMutation, useQuery} from '@apollo/client'
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';


const NUEVO_CUPON = gql`
    mutation nuevoCupon($input: CuponInput){
        nuevoCupon(input: $input){
            nombre
        }
    }
`;

const OBTENER_CUPONES = gql`
    query obtenerCuponesEmpresa{
        obtenerCuponesEmpresa{
            nombre
            descuento
            vigencia
            id
        }
    }
`;

const nuevoCupon = () =>{
    const router = useRouter();

    const [nuevoCupon] = useMutation(NUEVO_CUPON, {
        update(cache, {data:{nuevoCupon}}){
            //obtener el objeto de cache que deseamos actualizar
            const {obtenerCuponesEmpresa} = cache.readQuery({query: OBTENER_CUPONES});

            //reescribimos el cache (el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_CUPONES,
                data:{
                    obtenerCuponesEmpresa: [...obtenerCuponesEmpresa, nuevoCupon]
                }
            })
        }
    });

    const yesterday = new Date(Date.now() -86400000);
    const formik = useFormik({
        initialValues:{
            nombre: '',
            descuento: '',
            vigencia: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre del producto es obligatorio'),
            descuento: Yup.number('El precio debe de ser un digito').required('El precio es obligatorio').positive("El precio debe de ser positivo").max(100,"El descuento maximo puede ser del 100%"),
            vigencia: Yup.date().required('La fecha de vencimiento es necesaria').min(yesterday,"ingresar una fecha valida")
        }),
        onSubmit: async valores =>{
            const {nombre,vigencia,descuento} = valores;
            
            try {
                const {data} = await nuevoCupon({
                    variables:{
                        input:{
                            nombre,
                            descuento,
                            vigencia
                        }
                    }
                })
                Swal.fire(
                    'Creado',
                    'Se creó el Cupon correctamente',
                    'success'
                )
                router.push('/controlpanel/cupones');
            } catch (error) {
                console.log(error);
            }
        }
    });         

    return(
        <LayouUsuarios>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Cupon</h1>

            <div className="flex justify-center mt-5 ">
                <div className="w-full max-w-lg "> 
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>     
                        <div className="mb-4">
                            <div>
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre"
                                type= "text"
                                placeholder="Nombre Producto"
                                onChange={formik.handleChange}
                                onBlur = {formik.handleBlur}
                                value = {formik.values.nombre}
                                />
                            </div>

                            { formik.touched.nombre && formik.errors.nombre ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.nombre}</p>
                                </div>
                            ) : null}
                        </div>
                        <div className="mb-4">
                            <div >
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="descuento">
                                    Descuento
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="descuento"
                                type= "number"
                                placeholder="descuento"
                                onChange={formik.handleChange}
                                onBlur = {formik.handleBlur}
                                value = {formik.values.descuento}
                                />
                            </div>

                            { formik.touched.descuento && formik.errors.descuento ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.descuento}</p>
                                </div>
                            ) : null}
                        </div>
                        <div className="mb-4">
                            <div >
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="vigencia">
                                    Fecha de vencimiento
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="vigencia"
                                type= "date"
                                onChange={formik.handleChange}
                                onBlur = {formik.handleBlur}
                                value = {formik.values.vigencia}
                                />
                            </div>

                            { formik.touched.vigencia && formik.errors.vigencia ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.vigencia}</p>
                                </div>
                            ) : null}
                        </div>
                        
                        <input type="submit" className="bg-gray-800  w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Registrar Cupon"/>
                         
                    </form>    
                </div>
            </div>
        </LayouUsuarios>
    )
}

export default nuevoCupon;