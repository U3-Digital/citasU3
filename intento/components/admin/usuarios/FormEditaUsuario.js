import React,{useState} from 'react'
import {useQuery, gql,useMutation} from '@apollo/client';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import Select from 'react-select';
import {useRouter} from 'next/router';

const ACTUALIZAR_USUARIO = gql`
    mutation actualizarUsuario($id: ID!, $input: UsuarioInputActualizar){
        actualizarUsuario(id: $id, input: $input){
            nombre
    }
}
`;

const options = [
    { value: 'HABILITADO', label: 'Habilitado' },
    { value: 'DESHABILITADO', label: 'Deshabilitado' }
]

const optionsrol = [
    { value: 'SUPERADMINISTRADOR', label: 'Superadministrador' },
    { value: 'ADMINISTRADOR', label: 'Administrador' },
    { value: 'EMPLEADO', label: 'Empleado' }
  ]

const OBTENER_UN_USUARIO =gql`
    query obtenerUnUsuario($id: ID!){
        obtenerUnUsuario(id: $id){
          id
          nombre
          apellido
          email
          telefono
          status
          rol
          empresa{
               nombre
               id
          }
        }
    }
`
const OBTENER_EMPRESAS = gql`
    query obtenerEmpresas{
        obtenerEmpresas{
            id
            nombre
        }
    }
`;

const FormEditaUsuario = ({id}) =>{
    const router = useRouter();
    const [rol,setRol] = useState(null);
    const [status,setStatus] = useState(null);
    const [empresa,setEmpresa] = useState(null);
    const [valido,setValido] = useState([]);
    const [actualizarUsuario] = useMutation(ACTUALIZAR_USUARIO);

    const {data: dataE, error: errorE, loading: loadingE} =useQuery(OBTENER_EMPRESAS);


    const {data,loading,error} = useQuery(OBTENER_UN_USUARIO,{
        variables:{
            id
        }
    });
    if(loading) return 'Cargando...';
    const {obtenerUnUsuario} = data;
    //console.log(obtenerUnUsuario);
    if(status === null){
        if(obtenerUnUsuario.status ==="HABILITADO"){
            setStatus({ value: 'HABILITADO', label: 'Habilitado' })
        }else{
            setStatus({ value: 'DESHABILITADO', label: 'Deshabilitado' });
        }
    }
    if(empresa === null){
        if(obtenerUnUsuario.rol !== "SUPERADMINISTRADOR"){
            setValido(false);
            setEmpresa(obtenerUnUsuario.empresa);
        }
        
    }
    if(rol === null){
        if(obtenerUnUsuario.rol ==="SUPERADMINISTRADOR"){
            setRol({ value: 'SUPERADMINISTRADOR', label: 'Superadministrador' })
        }else if(obtenerUnUsuario.rol ==="ADMINISTRADOR"){
            setRol({ value: 'ADMINISTRADOR', label: 'Administrador' })
        }else{
            setRol({ value: 'EMPLEADO', label: 'Empleado' });
        }

        
    }


    if(loadingE) return "Cargando...";
    const {obtenerEmpresas} =dataE;


    
    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            email: Yup.string().required('El email es obligatorio'),
            password: Yup.string(),
            telefono: Yup.string().required('El telefono es obligatorio'),
            status: Yup.string().required('El status es obligatorio'),
            rol: Yup.string().required('El rol es obligatorio')
    });
    

    const seleccionarRol = seleccion =>{
       
        setRol(seleccion);  
        if(seleccion.value === "SUPERADMINISTRADOR"){
            setValido(true);
            
            setEmpresa('');
        }else{
            setValido(false);
        }
    }
    const actualizarInfoUsuario = async (valores) =>{
        const {nombre,apellido,email,password,telefono,status,rol} = valores;
        try {
            const {data} = await actualizarUsuario({
                variables:{
                    id,
                    input:{
                        nombre,
                        apellido,
                        email,
                        password,
                        telefono,
                        status,
                        rol,
                        empresa: empresa.id
                    }
                }
            }) ;    
            await Swal.fire(
                'Actualizado',
                'El usuario se actualizo correctamente',
                'success'
            )
            router.push('/4dm1n/usuarios');
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <Formik
            validationSchema={schemaValidacion}
            enableReinitialize
            initialValues={obtenerUnUsuario}
            onSubmit= { (valores, fuciones) =>{
                actualizarInfoUsuario(valores);
            }}
        >
            {props=>{
            //console.log(props);
            
                return (
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>
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
                            <div className="mb-4 ml-2 xl:w-1/2 sm:w-2/2">
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                    Apellido
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="apellido"
                                type= "text"
                                placeholder="Apellido Usuario"
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
                        <div className="xl:flex">
                            <div className="mb-4  xl:w-1/2 sm:w-2/2">
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type= "email"
                                placeholder="Email Usuario"
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

                            <div className="mb-4 ml-2 xl:w-1/2 sm:w-2/2">
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type= "password"
                                placeholder="Password Usuario"
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


                            <div className="mb-4 ml-2 xl:w-1/2 sm:w-2/2">
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                    Status
                                </label>
                                <Select
                                 id="status"
                                 options={options}
                                 placeholder="Status del usuario"
                                 onChange={selectedOption => {
                                    props.handleChange("status")(selectedOption.value);
                                    setStatus(selectedOption);
                                  }}
                                value={status}
                                onBlur = {props.handleBlur}
                                 />
                            </div>
                            { props.touched.status && props.errors.status ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.status}</p>
                                </div>
                            ) : null}   
                        </div>
                        <div className="xl:flex">
                            <div className="mb-4 xl:w-1/2 sm:w-2/2">
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="rol">
                                    Rol
                                </label>
                                <Select
                                 id="rol"
                                 options={optionsrol}
                                 onChange ={(opcion) =>{
                                    props.handleChange("rol")(opcion.value)
                                    props.handleChange('empresa')('')
                                    seleccionarRol(opcion)}}
                                 placeholder="Rol del usuario"
                                 value={rol}
                                 />
                            </div>
                            <div className="mb-4 ml-2 xl:w-1/2 sm:w-2/2">
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
                                 value={empresa}
                                 isDisabled = {valido}
                                 onChange= {selectedOption => {
                                    //console.log(selectedOption.value);
                                    props.handleChange("empresa")(selectedOption.id);
                                    setEmpresa(selectedOption);
                                  }}
                                 />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <input type="submit" className="bg-gray-800  w-auto mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Actualizar Usuario"/>
                        </div>     
                    </form>            
                )
            }}
        </Formik>
    )
}

export default FormEditaUsuario;