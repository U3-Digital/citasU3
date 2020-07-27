import React,{useState,useEffect} from 'react'
import {gql,useQuery,useMutation} from '@apollo/client';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';
import Select from 'react-select'


const OBTENER_CLIENTE = gql`
    query obtenerCliente ($id: ID!){
        obtenerCliente(id: $id){
            nombre
            apellido
            email
            telefono
            status
        }
    }
`;

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput ){
        actualizarCliente(id: $id, input: $input){
            nombre
            status
        }
    }
`;


const optionsStatus = [
    { value: 'HABILITADO', label: 'Habilitado' },
    { value: 'DESHABILITADO', label: 'Deshabilitado' }
]



const FormEditaCliente = ({id}) =>{
    const router = useRouter();
    const [status,setStatus] = useState(null);
    const [mensaje,guardarMensaje] = useState(null);    

    

    const {data,loading,error} = useQuery(OBTENER_CLIENTE,{
        variables:{
            id
        }
    });

    
    
    const[actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

    if(loading) return('Cargando...');
    const {obtenerCliente} = data;

    if(status === null){
        if(obtenerCliente.status === "HABILITADO"){
            setStatus({ value: 'HABILITADO', label: 'habilitado' })
        }else{
            setStatus({ value: 'DESHABILITADO', label: 'Deshabilitado' })
        }
    }
    
    

    const schemaValidacion = Yup.object({
        nombre: Yup.string().required(' el nombre es necesario'),
        apellido: Yup.string().required('El apellido es necesario'),
        email: Yup.string().required('El correo es necesario'),
        telefono: Yup.string(),
        status: Yup.string().required('favor de colocar el status del cliente')
    });



    const actualizaInfoCliente = async (valores) =>{
        const {nombre, apellido, telefono, email, status} = valores

        try {
            const {data} = await actualizarCliente({
                variables:{
                    id,
                    input:{
                        nombre,
                        apellido,
                        email,
                        telefono,
                        status
                    }
                }
            })
            await Swal.fire(
                'Listo',
                'El cliente fue actualizado con exito',
                'success'
            )
            router.push('/controlpanel/clientes');    
        } catch (error) {
            guardarMensaje(error.message.replace('GraphQL error: ',''));

            setTimeout(() => {
                guardarMensaje(null);
            }, 2000);
        }
    }
    
    const mostrarmensaje = () =>{
        return(
            <div className = "bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    } 

    return(
        <Formik
            validationSchema={schemaValidacion}
            enableReinitialize
            initialValues={obtenerCliente}
            onSubmit= { (valores, fuciones) =>{
                actualizaInfoCliente(valores);
            }}
        >
            {props =>{
                return(
                    <form className=" bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>
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
                                    onChange={props.handleChange}
                                    onBlur = {props.handleBlur}
                                    value = {props.values.apellido}
                                    />
                                </div>

                                { props.touched.apellido && props.errors.apellido ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.apellido}</p>
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
                                    onChange={props.handleChange}
                                    onBlur = {props.handleBlur}
                                    value = {props.values.email}
                                    />
                                </div>

                                { props.touched.email && props.errors.email ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.email}</p>
                                    </div>
                                ) : null}
                            </div>
                            <div className="xl:w-1/2 xl:ml-2 sm:w-2/2">
                            <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                        Telefono
                                    </label>
                                    <input 
                                    className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="telefono"
                                    type= "text"
                                    placeholder="Telefono Cliente"
                                    onChange={props.handleChange}
                                    onBlur = {props.handleBlur}
                                    value = {props.values.telefono}
                                    />
                                </div>

                                { props.touched.telefono && props.errors.telefono ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.telefono}</p>
                                    </div>
                                ) : null}         
                            </div>             
                        </div>
                        <div className="xl:flex justify-center">
                            <div className="xl:w-1/2  sm:w-2/2">
                                <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Status
                                    </label>
                                    <Select
                                        id="status"
                                        options={optionsStatus}
                                        placeholder="Status del usuario"
                                        onChange={selectedOption => {
                                            props.handleChange("status")(selectedOption.value);
                                            setStatus(selectedOption);
                                        }}
                                        value={status}
                                        onBlur = {props.handleBlur}
                                    />
                                </div>

                                { props.touched.status  && props.errors.status  ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.status    }</p>
                                    </div>
                                ) : null}
                            </div>           
                        </div>
                        
                        {mensaje && mostrarmensaje()}
                        <div className="flex justify-end">
                            <input type="submit" className="bg-gray-800 mb-0 w-auto mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Registrar Cliente"/>
                        </div> 
                        
                    </form>
                )
            }}
        </Formik>
    );
}

export default FormEditaCliente;