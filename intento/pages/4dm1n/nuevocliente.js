import React, {useState} from 'react'
import LayoutAdmin from '../../components/admin/LayoutAdmin';
import {useFormik, useField} from 'formik';
import * as Yup from 'yup';
import {gql, useMutation, useQuery} from '@apollo/client'
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';
import Select from 'react-select'

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput){
        nuevoCliente(input: $input){
            id
            nombre
            apellido
            email
            telefono
            status
            empresa{
                nombre
            }
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

const OBTENER_CLIENTES = gql `
    query obtenerClientes{
        obtenerClientes{
            id
            nombre
            apellido
            email
            empresa{
                nombre
            }
        }
    }
`;



const optionsStatus = [
    { value: 'HABILITADO', label: 'Habilitado' },
    { value: 'DESHABILITADO', label: 'Deshabilitado' },
    { value: 'PENDIENTE', label: 'Pendiente'}
]

const NuevoCliente = () =>{
    const router = useRouter();
    const [empresa,setEmpresa] = useState([]);
    const [status,setStatus] = useState([]);
    const [mensaje,guardarMensaje] = useState(null);


    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        update(cache, {data:{NuevoCliente}}){
            //obtener el objeto de cache que deseamos actualizar
            const {obtenerClientes} = cache.readQuery({query: OBTENER_CLIENTES});

            //reescribimos el cache (el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_CLIENTES,
                data:{
                    obtenerClientes: [...obtenerClientes, nuevoCliente]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues:{
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            status: '',
            password: '',
            empresa: ''
        },
        validationSchema : Yup.object({
            nombre: Yup.string().required(' el nombre es necesario'),
            apellido: Yup.string().required('El apellido es necesario'),
            email: Yup.string().required('El correo es necesario'),
            telefono: Yup.string().required('Es obligatorio el telefono del cliente'),
            status: Yup.string().required('favor de colocar el status del cliente'),
            password: Yup.string().required('La contrseña es necesaria'),
            empresa : Yup.string().required('es necesario')
        }),
        onSubmit: async valores =>{
            const {nombre,apellido,email,password,telefono,status,empresa} = valores;
            try {
                const {data} = await nuevoCliente({
                    variables:{
                        input:{
                            nombre,
                            apellido,
                            email,
                            password,
                            telefono,
                            status,
                            empresa
                        }
                    }
                });  
                console.log(data);
                Swal.fire(
                    'Creado',
                    'Se creó la empresa correctamente',
                    'success'
                )
                router.push('/4dm1n/clientes');//redireccionar a empresas 

            } catch (error) {
                guardarMensaje(error.message.replace('GraphQl error: ',''));
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
                //console.log(error);
            }
        }
    });

    const mostrarmensaje = () =>{
        return(
            <div className = " flex bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5 mr-1" stroke="currentColor"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p>{mensaje}</p>
            </div>
        )
    } 

    
    const   {data,loading,error} =useQuery(OBTENER_EMPRESAS);
    if(loading) return 'Cargando...';
    const {obtenerEmpresas} =data;

    return(
        <LayoutAdmin>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>


            <div className="flex justify-center mt-5">
                <div className="w-full max-w-4xl"> 
                   <form className=" bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                        <div className=" xl:flex">
                            <div className="xl:w-1/2 sm:w-2/2">
                                <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                        Nombre
                                    </label>
                                    <input 
                                    className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type= "text"
                                    placeholder="Nombre Cliente"
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
                            <div className="xl:w-1/2 xl:ml-2 sm:w-2/2">
                                <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                        Apellido
                                    </label>
                                    <input 
                                    className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="apellido"
                                    type= "text"
                                    placeholder="Apellido Cliente"
                                    onChange={formik.handleChange}
                                    onBlur = {formik.handleBlur}
                                    value = {formik.values.apellido}
                                    />
                                </div>

                                { formik.touched.apellido && formik.errors.apellido ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.apellido}</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="xl:flex">
                            <div className="xl:w-1/2 sm:w-2/2">
                                <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input 
                                    className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type= "email"
                                    placeholder="Email Cliente"
                                    onChange={formik.handleChange}
                                    onBlur = {formik.handleBlur}
                                    value = {formik.values.email}
                                    />
                                </div>

                                { formik.touched.email && formik.errors.email ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.email}</p>
                                    </div>
                                ) : null}
                            </div>
                            <div className="xl:w-1/2 xl:ml-2 sm:w-2/2">
                                <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <input 
                                    className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type= "password"
                                    placeholder="Password Cliente"
                                    onChange={formik.handleChange}
                                    onBlur = {formik.handleBlur}
                                    value = {formik.values.password}
                                    />
                                </div>

                                { formik.touched.password && formik.errors.password ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.password}</p>
                                    </div>
                                ) : null}
                            </div>             
                        </div>
                        <div className="xl:flex">
                            <div className="xl:w-1/2 sm:w-2/2">
                                <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                        Telefono
                                    </label>
                                    <input 
                                    className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="telefono"
                                    type= "text"
                                    placeholder="Telefono Cliente"
                                    onChange={formik.handleChange}
                                    onBlur = {formik.handleBlur}
                                    value = {formik.values.telefono}
                                    />
                                </div>

                                { formik.touched.telefono && formik.errors.telefono ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.telefono}</p>
                                    </div>
                                ) : null}
                            </div> 
                            <div className="xl:w-1/2 xl:ml-2 sm:w-2/2">
                                <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Status
                                    </label>
                                    <Select
                                        id="status"
                                        options={optionsStatus}
                                        placeholder="Status del usuario"
                                        onChange={selectedOption => {
                                            formik.handleChange("status")(selectedOption.value);
                                            setStatus(selectedOption);
                                        }}
                                        value={status}
                                        onBlur = {formik.handleBlur}
                                    />
                                </div>

                                { formik.touched.status  && formik.errors.status  ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.status    }</p>
                                    </div>
                                ) : null}
                            </div>           
                        </div>
                        <div className="xl:flex xl:justify-center">
                            <div className="xl:w-1/2   sm:w-2/2">
                                <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
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

                                { formik.touched.empresa && formik.errors.empresa ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.empresa}</p>
                                    </div>
                                ) : null}
                            </div>
                                      
                        </div>
                        {mensaje && mostrarmensaje()}
                        <div className="flex justify-end">
                            <input type="submit" className="bg-gray-800 mb-0 w-auto mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Registrar Cliente"/>
                        </div> 
                        
                    </form>
                </div>
            </div>

        </LayoutAdmin>
        
    )
}

export default NuevoCliente;