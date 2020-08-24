import React,{useState} from 'react'
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
            empresa{
                id
                nombre
            }
        }
    }
`;

const ACTUALIZAR_CLIENTE = gql `
    mutation actualizarCliente($id: ID!, $input: ClienteInput ){
        actualizarCliente(id: $id, input: $input){
            nombre
            status
        }
    }
`;


const optionsStatus = [
    { value: 'HABILITADO', label: 'Habilitado' },
    { value: 'DESHABILITADO', label: 'Deshabilitado' },
    { value: 'PENDIENTE', label: 'Pendiente'}
]

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


const FormEditaCliente  = ({id}) =>{
    const router = useRouter();
    const [empresa,setEmpresa] = useState(null);
    const [status,setStatus] = useState(null);
    const [mensaje,guardarMensaje] = useState(null);

    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);



    const {data,loading,error} = useQuery(OBTENER_CLIENTE,{
        variables:{
            id
        }
    });


    const {data: dataEmpresas, loading: loadingEmpresas, error: errorEmpresas} = useQuery(OBTENER_EMPRESAS);

    const schemaValidacion = Yup.object({
        nombre: Yup.string().required(' el nombre es necesario'),
        apellido: Yup.string().required('El apellido es necesario'),
        email: Yup.string().required('El correo es necesario'),
        telefono: Yup.string().required('Es obligatorio el telefono del cliente'),
        status: Yup.string().required('favor de colocar el status del cliente'),
        password: Yup.string().min(6,"La contraseña debe tener un minimo de 6 caracteres")
    });


    const actualizaInfoCliente = async (valores) =>{
        const {nombre,apellido,email,telefono,password,status} = valores;
        let empresas = [];
        empresa.map(empresaunica =>{
            empresas.push(empresaunica.id);
        });
        

        if(password){
            try {
                const {data} = actualizarCliente({
                    variables:{
                      id,
                      input:{
                          nombre,
                          apellido,
                          email,
                          telefono,
                          password,
                          status,
                          empresa: empresas
                      }
                    }
                });
                Swal.fire(
                'Listo',
                'El cliente fue actualizado con exito',
                'success'
                );  
                
                router.push('/4dm1n/clientes');
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQl error: ',''));
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);    
            } 
        }else{
            try {
                const {data} = actualizarCliente({
                    variables:{
                      id,
                      input:{
                          nombre,
                          apellido,
                          email,
                          telefono,
                          status,
                          empresa: empresas
                      }
                    }
                });
                await Swal.fire(
                'Listo',
                'El cliente fue actualizado con exito',
                'success'
                );  
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQl error: ',''));
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);    
            }
        } 
    }
    if(loadingEmpresas) return('Cargando...');
    if(loading) return ('Cargando..');
    const {obtenerCliente} = data;
    const {obtenerEmpresas} = dataEmpresas;
    
    const mostrarmensaje = () =>{
        return(
            <div className = " flex bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5 mr-1" stroke="currentColor"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p>{mensaje}</p>
            </div>
        )
    } 

    if(status === null){
        if(obtenerCliente.status ==="HABILITADO"){
            setStatus({ value: 'HABILITADO', label: 'Habilitado' })
        }else{
            setStatus({ value: 'DESHABILITADO', label: 'Deshabilitado' });
        }
    }
    if(empresa === null){
        setEmpresa(obtenerCliente.empresa);
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
                                        <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                            Password
                                        </label>
                                        <input 
                                        className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="password"
                                        type= "password"
                                        placeholder="Password Cliente"
                                        onChange={props.handleChange}
                                        onBlur = {props.handleBlur}
                                        value = {props.values.password}
                                        />
                                    </div>

                                    { props.touched.password && props.errors.password ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.password}</p>
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
                                            isMulti= {true}
                                            onChange= {selectedOption => {
                                                //console.log(selectedOption.value);
                                                setEmpresa(selectedOption);
                                            }}
                                            value= {empresa}
                                        />
                                    </div>

                                    { props.touched.empresa && props.errors.empresa ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.empresa}</p>
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
    )
}

export default FormEditaCliente;