import React from 'react'
import LayoutUsuarios from '../../components/panel/LayoutUsuarios';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import { gql , useMutation, useQuery} from '@apollo/client'
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';


const NUEVO_PRODUCTO = gql`
    mutation nuevoproducto($input : ProductoInput){
        nuevoProducto(input: $input){
            nombre
            precio
        }
    }
`;

const OBTENER_PRODUCTOS = gql`
    query obtenerProductosEmpresa{
        obtenerProductosEmpresa{
            id
            nombre
            precio
        }
    }          
`;

const nuevoProducto = () =>{
    const router = useRouter();
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, {data:{nuevoProducto}}){
            //obtener el objeto de cache que deseamos actualizar
            const {obtenerProductosEmpresa} = cache.readQuery({query: OBTENER_PRODUCTOS});

            //reescribimos el cache (el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data:{
                    obtenerProductosEmpresa: [...obtenerProductosEmpresa, nuevoProducto]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues:{
            nombre: '',
            precio: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre del producto es obligatorio'),
            precio: Yup.number('El precio debe de ser un digito').required('El precio es obligatorio').positive("El precio debe de ser positivo"),
        }),
        onSubmit: async valores =>{
            const {nombre, precio} = valores;
            try {
                const {data} = await nuevoProducto({
                    variables:{
                        input:{
                            nombre,
                            precio
                        }
                    }
                })
                Swal.fire(
                    'Creado',
                    'Se creó el producto correctamente',
                    'success'
                )
                router.push('/controlpanel/productos');
            } catch (error) {
                console.log(error);
            }
        }
    });



    return(
        <LayoutUsuarios>
            <h1 className="text-2xl text-gray-800 font-light">Agregar Producto</h1>
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
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                    Precio
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="precio"
                                type= "number"
                                placeholder="Precio producto"
                                onChange={formik.handleChange}
                                onBlur = {formik.handleBlur}
                                value = {formik.values.precio}
                                />
                            </div>

                            { formik.touched.precio && formik.errors.precio ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.precio}</p>
                                </div>
                            ) : null}
                        </div>
                        <div className="flex justify-center">
                            <input type="submit" className="bg-gray-800  w-auto mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Registrar Usuario"/>
                        </div> 
                    </form>    
                </div>
            </div>
        </LayoutUsuarios>
    )
}
export default nuevoProducto;