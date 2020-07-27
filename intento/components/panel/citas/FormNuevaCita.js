import React,{useState} from 'react'
import {useFormik, useField} from 'formik';
import * as Yup from 'yup';
import {gql, useMutation, useQuery} from '@apollo/client'
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';
import Select from 'react-select'

const OBTENER_CLIENTES = gql `
    query obtenerClientesEmpresa{
        obtenerClientesEmpresa{
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

const OBTENER_USUARIOS = gql`
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

const FormNuevaCita = () =>{
    const router = useRouter();
    const [mensaje,guardarMensaje] = useState(null);
    const [cliente, setcliente] = useState([]);
    const [producto,setproducto] = useState([]);
    const [totalstate, settotal] = useState([])
    const formik = useFormik({
        initialValues:{
            fecha: '',
            cliente: '',
            empleado: ''
        },
        validationSchema:Yup.object({
            fecha: Yup.date().required('La fecha es necesaria'),
            cliente: Yup.string().required('El cliente es necesario'),
            empleado: Yup.string().required('Favor de ingresar el usuario que va a realizar el trabajo'),
            
        }),
        onSubmit: async valores =>{
            console.log(valores);
        }
    })

    const mostrarmensaje = () =>{
        return(
            <div className = "bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    } 
    const {data,loading,error} = useQuery(OBTENER_CLIENTES);
    const {data: dataUsuarios, loading: loadingUsuarios, error: errorUsuario} = useQuery(OBTENER_USUARIOS);
    if(loadingUsuarios) return ('Cargando Usuarios...');
    if(loading) return('Cargando---')
    const {obtenerUsuarios} =dataUsuarios;
    const {obtenerClientesEmpresa} = data;

    //console.log(obtenerUsuarios);

    return(
        <div className="flex justify-center mt-5">
            <div className="w-full max-w-4xl"> 
                <form className=" bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                    <div className=" xl:flex">
                        <div className="mb-4 ml-2 xl:w-1/2 sm:w-2/2">
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                    Cliente
                                </label>
                                <Select
                                 id="cliente"
                                 options={obtenerClientesEmpresa}
                                 placeholder="cliente "
                                 getOptionValue={opciones => opciones.id}
                                 getOptionLabel={opciones => opciones.email}
                                 noOptionsMessage= {() =>"No hay resultados"}
                                 onChange= {selectedOption => {
                                    //console.log(selectedOption.value);
                                    formik.handleChange("cliente")(selectedOption.id);
                                    setcliente(selectedOption);
                                  }}
                                 />
                        </div>

                        { /*formik.touched.nombre && formik.errors.nombre ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null*/}
                        <div className="mb-4 ml-2 xl:w-1/2 sm:w-2/2">
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                    Usuario
                                </label>
                                <Select
                                 id="cliente"
                                 options={obtenerUsuarios}
                                 placeholder="usuario"
                                 getOptionValue={opciones => opciones.id}
                                 getOptionLabel={opciones => `${opciones.nombre} ${opciones.apellido}` }
                                 noOptionsMessage= {() =>"No hay resultados"}
                                 onChange= {selectedOption => {
                                    //console.log(selectedOption.value);
                                    formik.handleChange("cliente")(selectedOption.id);
                                    setcliente(selectedOption);
                                  }}
                                 />
                        </div>
                    </div>
                    <div className="xl:flex">
                        <div className="mb-4 ml-2 xl:w-1/2 sm:w-2/2">
                        <div >
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha">
                                    Fecha de la cita
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="fecha"
                                type= "date"
                                onChange={formik.handleChange}
                                onBlur = {formik.handleBlur}
                                value = {formik.values.fecha}
                                />
                            </div>

                            { formik.touched.fecha && formik.errors.fecha ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.fecha}</p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FormNuevaCita;