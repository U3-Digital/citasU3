import React, {useState} from 'react'
import {useFormik} from 'formik';
import * as Yup from 'yup';
import { gql , useMutation, useQuery} from '@apollo/client'
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';
import Select from 'react-select'


const NUEVO_PRODUCTO = gql`
    mutation nuevoproducto($input : ProductoInput){
        nuevoProducto(input: $input){
            id
            nombre
            precio
            empresa
        }
    } 
`;

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

const OBTENER_PRODUCTOS= gql`
    query obtenerProductos($id: ID!){
        obtenerProductos(id: $id){
            id
            nombre
            precio
            empresa
        }
    }
`;


const FormNuevoProducto = () =>{

    const router = useRouter();
    const [empresa,setEmpresa] = useState([]);

    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO/*, {
        update(cache, {data:{nuevoProducto}}){
            //obtener el objeto de cache que deseamos actualizar
            const {obtenerProductos} = cache.readQuery({query: OBTENER_PRODUCTOS});

            //reescribimos el cache (el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                variables:{
                    id: empresa.id
                },
                data:{
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            })
        }
    }*/)


    const formik = useFormik({
        initialValues:{
            nombre: '',
            precio: '',
            empresa: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre del producto es obligatorio'),
            precio: Yup.number('El precio debe de ser un digito').required('El precio es obligatorio').positive("El precio debe de ser positivo"),
            empresa: Yup.string().required('La Empresa del producto es obligatoria')
        }),
        onSubmit: async valores =>{
            const {nombre,precio,empresa: empresaI} = valores
            

            try {
                const {data} = await nuevoProducto({
                    variables:{
                        input:{
                            nombre,
                            precio,
                            empresa: empresaI
                        }
                    }
                });

                //console.log(data)

                Swal.fire(
                    'Creado',
                    'Se creó la empresa correctamente',
                    'success'
                )
                router.push('/4dm1n/productos');//redireccionar a empresas    
            } catch (error) {
                console.log(error);
            }

        }
    })
    const {data,loading,error} =useQuery(OBTENER_EMPRESAS);
    if(loading) return 'Cargando...';

    const {obtenerEmpresas} = data;

    return( 
        <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
            <div className="xl:flex">     
                <div className="mb-4 xl:w-1/2 sm:w-2/2">
                    <div >
                        <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                            Nombre
                        </label>
                        <input 
                        className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="nombre"
                        type= "text"
                        placeholder="Nombre Usuario"
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
                <div className="mb-4 xl:w-1/2 xl:ml-2 sm:w-2/2">
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
            </div>
            <div className="xl:flex">
                <div className="mb-4 ml-2 xl:w-full sm:w-2/2">
                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                        Empresa
                    </label>
                    <Select
                    id="empresa"
                    options={obtenerEmpresas}
                    placeholder="Empresa del usuario"
                    getOptionValue={opciones => opciones.id}
                    getOptionLabel={opciones => opciones.nombre}
                    noOptionsMessage= {() =>"No hay resultados"}
                    onChange= {selectedOption => {
                        //console.log(selectedOption.value);
                        formik.handleChange("empresa")(selectedOption.id);
                        setEmpresa(selectedOption);
                    }}
                    />
                </div>              
            </div>
            <div className="flex justify-center">
                <input type="submit" className="bg-gray-800  w-auto mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Registrar Producto"/>
            </div> 
        </form>
    )
}

export default FormNuevoProducto;