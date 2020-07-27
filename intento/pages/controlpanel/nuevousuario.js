import React,{useState} from 'react'
import LayoutUsuarios from '../../components/panel/LayoutUsuarios';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {gql, useMutation, useQuery} from '@apollo/client'
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';
import Select from 'react-select';



const NUEVO_USUARIO = gql`
    mutation nuevoUsuario($input: UsuarioInput){
        nuevoUsuario(input: $input){
            id
            nombre
            apellido
            email
            telefono
            status
            rol
            empresa{
                nombre
            }
        }
    }
`;

const OBTENER_USUARIOS = gql `
    query obtenerUsuarios{
        obtenerUsuarios{
            nombre
            apellido
            id
            email
            telefono
                status
            rol
        }
    }

`;


const options = [
    { value: 'HABILITADO', label: 'Habilitado' },
    { value: 'DESHABILITADO', label: 'Deshabilitado' }
]

const nuevoUsuario = () =>{
    const router = useRouter();
    const [status,setStatus] = useState([]);

    const [nuevousuario] = useMutation(NUEVO_USUARIO, {
        update(cache, {data:{nuevoUsuario}}){
            //obtener el objeto de cache que deseamos actualizar
            const {obtenerUsuarios} = cache.readQuery({query: OBTENER_USUARIOS});

            //reescribimos el cache (el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_USUARIOS,
                data:{
                    obtenerUsuarios: [...obtenerUsuarios, nuevoUsuario]
                }
            })
        }
    });


    const formik = useFormik({
        initialValues:{
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            telefono: '',
            status:''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            email: Yup.string().required('El email es obligatorio'),
            password: Yup.string().required('El password es obligatorio'),
            telefono: Yup.string().required('El telefono es obligatorio'),
            status: Yup.string().required('El status es obligatorio'),
            
        }),
        onSubmit: async valores =>{
            const {nombre, apellido, email, password, telefono, status, rol} = valores;
            try {
                const {data} = await nuevousuario({
                    variables:{
                        input: {
                            nombre,
                            apellido,
                            email,
                            password,
                            telefono,
                            status,
                            rol: "EMPLEADO"
                        }
                    }
                });
                //console.log(data);
                Swal.fire(
                    'Creado',
                    'Se creó la empresa correctamente',
                    'success'
                )
                router.push('/controlpanel/usuarios');//redireccionar a empresas 
            } catch (error) {
                console.log(error);
            }
        }
    })
    return(
        <LayoutUsuarios>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Usuario</h1>
            <div className="flex justify-center mt-5 ">
                <div className="w-full max-w-4xl "> 
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                        <div className="xl:flex">     
                            <div className="mb-4 xl:w-1/2 sm:w-2/2">
                                
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
                                

                                { formik.touched.nombre && formik.errors.nombre ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.nombre}</p>
                                    </div>
                                ) : null}
                            </div>    
                            <div className="mb-4 ml-2 xl:w-1/2 sm:w-2/2">
                                
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                        Apellido
                                    </label>
                                    <input 
                                    className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="apellido"
                                    type= "text"
                                    placeholder="Apellido Usuario"
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
                        <div className="xl:flex">
                            <div className="mb-4 xl:w-1/2 sm:w-2/2">
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type= "email"
                                placeholder="Email Usuario"
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

                            <div className="mb-4 ml-2 xl:w-1/2 sm:w-2/2">
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type= "password"
                                placeholder="Password Usuario"
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
                        <div className="xl:flex">
                            <div className="mb-4  xl:w-1/2 sm:w-2/2">
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                    Telefono
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="telefono"
                                type= "text"
                                placeholder="Telefono Usuario"
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


                            <div className="mb-4 ml-2 xl:w-1/2 sm:w-2/2">
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                    Status
                                </label>
                                <Select
                                 id="status"
                                 options={options}
                                 placeholder="Status del usuario"
                                 onChange={selectedOption => {
                                    formik.handleChange("status")(selectedOption.value);
                                    setStatus(selectedOption);
                                  }}
                                value={status}
                                onBlur = {formik.handleBlur}
                                 />
                            </div>
                            { formik.touched.status && formik.errors.status ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.status}</p>
                                </div>
                            ) : null}   
                        </div>
                        
                        <div className="flex justify-end">
                            <input type="submit" className="bg-gray-800  w-auto mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Registrar Usuario"/>
                        </div>     
                    </form> 
                </div>
            </div>
        </LayoutUsuarios>
    )
}

export default nuevoUsuario;