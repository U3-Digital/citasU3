import React from 'react'
import {gql,useQuery, useMutation} from '@apollo/client';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';
const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!){
        obtenerProducto(id: $id){
            id
            nombre
            precio
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput){
        actualizarProducto(id: $id, input: $input){
            nombre  
        }
    }
`;

const FormEditProducto = ({id}) =>{
    const router = useRouter();
    const {data,loading,error} = useQuery(OBTENER_PRODUCTO,{
        variables:{
            id
        }
    });
    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);
    if(loading) return('Cargando...');

    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre del producto es necesario'),
        precio: Yup.number().required('El precio es requerido').positive('Favor de ingresar numeros positivos')
    });
    
    const actualizaInfoProducto = async (valores) =>{
        const {nombre,precio} = valores;
        
        try {
            const {data} = actualizarProducto({
                variables:{
                    id,
                    input:{
                        nombre,
                        precio
                    }
                }
            });
            await Swal.fire(
                'Listo',
                'El cliente fue actualizado con exito',
                'success'
            );
            router.push('/4dm1n/productos');      
        } catch (error) {
            console.log(error)
        }
    }
    const {obtenerProducto} = data;
    return(
        <Formik
            validationSchema={schemaValidacion}
            enableReinitialize
            initialValues={obtenerProducto}
            onSubmit= { (valores, fuciones) =>{
                actualizaInfoProducto(valores);
            }}
        >
            {props =>{
                return(
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>     
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
                                onChange={props.handleChange}
                                onBlur = {props.handleBlur}
                                value = {props.values.nombre}
                                />
                            </div>

                            { props.touched.nombre && props.errors.nombre ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.nombre}</p>
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
                                onChange={props.handleChange}
                                onBlur = {props.handleBlur}
                                value = {props.values.precio}
                                />
                            </div>

                            { props.touched.precio && props.errors.precio ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.precio}</p>
                                </div>
                            ) : null}
                        </div>
                        <div className="flex justify-center">
                            <input type="submit" className="bg-gray-800  w-auto mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Actualizar Producto"/>
                        </div> 
                    </form>        
                )
            }}     
        </Formik>
    );
}
export default FormEditProducto;
