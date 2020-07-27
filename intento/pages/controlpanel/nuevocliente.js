import React, {useState} from 'react'
import LayoutUsuarios from '../../components/panel/LayoutUsuarios'
import {useFormik, useField} from 'formik';
import * as Yup from 'yup';
import {gql, useMutation, useQuery} from '@apollo/client'
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';
import Select from 'react-select'



const CREAR_CLIENTE =gql`
    mutation nuevoClienteEmpresa($input: ClienteInput){
        nuevoClienteEmpresa(input: $input){
            nombre
        }
    }
`;
const MANDAR_CORREO = gql`
    mutation correoEmpresa($input: CorreoInput){
        correoEmpresa(input: $input)
    }
`;
const optionsStatus = [
    { value: 'HABILITADO', label: 'Habilitado' },
    { value: 'DESHABILITADO', label: 'Deshabilitado' }
]

const nuevoCliente = () =>{
    const router = useRouter();
    const [status,setStatus] = useState([]);
    const [mensaje,guardarMensaje] = useState(null);

    const [nuevoClienteEmpresa] = useMutation(CREAR_CLIENTE);
    const [correoEmpresa] = useMutation(MANDAR_CORREO);

    const formik = useFormik({
        initialValues:{
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            status: '',
            password: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required(' el nombre es necesario'),
            apellido: Yup.string().required('El apellido es necesario'),
            email: Yup.string().required('El correo es necesario'),
            telefono: Yup.string().required('Es obligatorio el telefono del cliente'),
            status: Yup.string().required('favor de colocar el status del cliente'),
            password: Yup.string().required('La contrseña es necesaria')
        }),
        onSubmit: async valores =>{
            //console.log(valores);
            const {nombre,apellido,email,password,telefono,status} = valores;
            try {
                const {data} = await nuevoClienteEmpresa({
                    variables:{
                        input:{
                            nombre,
                            apellido,
                            email,
                            password,
                            telefono,
                            status
                        }
                    }
                })
                const {data: datamensaje} = await correoEmpresa({
                    variables:{
                        input:{
                            destinatario:email,
                            sujeto: `Bienvenido/a a U3Citas`,
                            cuerpo: `
                            <html>
                            <h1>Estimado/a ${nombre} ${apellido}:</h1><br>
                            <p>Le damos la bienvenida a U3Citas, ... aquí va un choro de bienvenida que no se</p>
                            <p>Para agendar su primera cita acceda a su perfil de U3Cita</p>
                            <a href="http://localhost:3000/login/[pid]?id=${15558}">Ingresa aqui!</a>
                            <p>psd el link no funciona ni lo intentes, pero ya te aceptamos</p>
                            <p>No responder a este mensaje</p>
                            </html>
                            
                            `
                        }
                    }
                }) 
                

                
                router.push('/controlpanel/clientes');
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ',''));

                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
            }
        }
    })

    const mostrarmensaje = () =>{
        return(
            <div className = "bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    } 
    
    return(
        <LayoutUsuarios>
            <h1 className="text-2xl text-gray-800 font-light">Registro Cliente</h1>
            {mensaje && mostrarmensaje()}
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
                        
                        {mensaje && mostrarmensaje()}
                        <div className="flex justify-end">
                            <input type="submit" className="bg-gray-800 mb-0 w-auto mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Registrar Cliente"/>
                        </div> 
                        
                    </form>
                </div>
            </div>
        </LayoutUsuarios>
    );
}

export default nuevoCliente;