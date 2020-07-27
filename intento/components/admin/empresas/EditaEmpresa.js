import React,{useState} from 'react'
import {useRouter} from 'next/router'
import { Formik } from 'formik';
import * as Yup from 'yup';
import {gql, useQuery, useMutation} from '@apollo/client';
import Swal from 'sweetalert2';
import Select from 'react-select';

const OBTENER_EMPRESA = gql`
    query obtenerEmpresa($id: ID!){
        obtenerEmpresa(id: $id){
            id
            nombre
            direccion
            email
            facebook
            instagram
            whatsapp
            fotos
            status
        }  
    }
`;

const options = [
    { value: 'HABILITADO', label: 'Habilitada' },
    { value: 'DESHABILITADO', label: 'Deshabilitada' }
]

const ACTUALIZAR_EMPRESA = gql`
    mutation actualizarEmpresa ($id: ID!, $input:  EmpresaInput){
        actualizarEmpresa(id: $id, input: $input){
            id
            nombre
            direccion
            email
            facebook
            instagram
            whatsapp
            fotos
        }
    }
`;
const EditaEmpresa = ({id}) =>{
    const router = useRouter();
    const [status,setStatus] = useState(null);
    const [file,setFile] =  useState(null);

    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre de la empresa es obligatorio'),
        direccion : Yup.string().required('La direccion del negocio es necesaria'),
        email: Yup.string().required('El campo de email no puede estar vacio'),
        foto: Yup.mixed(),
        facebook: Yup.string(),
        instagram: Yup.string(),
        whatsapp: Yup.string()
    })

   
    const [actualizarEmpresa] = useMutation(ACTUALIZAR_EMPRESA)


    const {data,loading,error} = useQuery(OBTENER_EMPRESA,{
        variables:{
            id
        }
    });

    if(loading) return 'Cargando...';

    const {obtenerEmpresa} = data;
    if(status === null){
        if(obtenerEmpresa.status === "HABILITADO"){
            setStatus({ value: 'HABILITADO', label: 'Habilitada' });
        }else{
            setStatus({ value: 'DESHABILITADO', label: 'Deshabilitada' });
        }
    }

    

   

        

    const ValoresIniciales ={
        id: obtenerEmpresa.id,
        email: obtenerEmpresa.email,
        nombre: obtenerEmpresa.nombre,
        direccion: obtenerEmpresa.direccion,
        facebook: obtenerEmpresa.facebook,
        instagram: obtenerEmpresa.instagram,
        whatsapp: obtenerEmpresa.whatsapp,
        status: status  
    }
        
    
    
    const fileSelectedHandler = (event) =>{
        setFile(event.target.files[0])
        //console.log();
    }
    

    const actualizarInfoEmpresa = async valores =>{
        const {nombre,direccion,email,facebook,instagram,whatsapp,fotos,status} = valores;
        console.log(fotos);    
        try {
            const {data} = await actualizarEmpresa({
                variables:{
                    id,
                    input:{
                        nombre,
                        direccion,
                        email,
                        facebook,
                        instagram,
                        whatsapp,
                        status: status.value,
                        fotos  
                    }
                }
            });
            //console.log(data);
            await Swal.fire(
                'Atualizado',
                'La empresa se actualizo correctamente',
                'success'
            )
            router.push('/4dm1n/empresas');
        } catch (error) {
            console.log(error);
        }
    }
    

    return(
        <div className="flex justify-center mt-5">
            <div className="w-full max-w-4xl">
                <Formik
                    enableReinitialize
                    initialValues= {ValoresIniciales}
                    validationSchema={schemaValidacion}
                    onSubmit={valores =>{
                        console.log(valores);
                        actualizarInfoEmpresa(valores);
                    }}
                >
                    {props =>{
                        return(
                            <>
                                <form className=" bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>
                                    <div className="flex">
                                        <div className="w-1/2">
                                            <div className="mb-4">
                                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                                    Nombre
                                                </label>
                                                <input 
                                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="nombre"
                                                type= "text"
                                                placeholder="Nombre Empresa"
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

                                            <div className="mb-4">
                                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
                                                    Direccion
                                                </label>
                                                <input 
                                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="direccion"
                                                type= "text"
                                                placeholder="Direccion Empresa"
                                                onChange={props.handleChange}
                                                onBlur = {props.handleBlur}
                                                value = {props.values.direccion}
                                                />
                                            </div>
                                            
                                            { props.touched.direccion && props.errors.direccion ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error</p>
                                                    <p>{props.errors.direccion}</p>
                                                </div>
                                            ) : null}
                                            <div className="mb-4">
                                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                                    Email
                                                </label>
                                                <input 
                                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="email"
                                                type= "email"
                                                placeholder="Email Empresa"
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
                                            
                                            <div className="mb-4">
                                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                                    Status
                                                </label>
                                                <Select
                                                    id="status"
                                                    options={options}
                                                    placeholder="Status de la empresa"
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
                                        <div className="mb-4 w-1/2 ml-5">
                                            <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="foto">
                                                Foto
                                            </label>
                                            <img src="https://www.imor.es/wp-content/uploads/2017/09/imagen-de-prueba-320x240.jpg" className="justify center w-11 h-11"></img>
                                            <input 
                                            className=" shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="foto"
                                            type= "file"

                                            onChange={archivo =>{
                                                fileSelectedHandler(archivo);
                                            }}
                                            onBlur = {props.handleBlur}
                                            
                                            />
                                        </div>
                                        
                                        { props.touched.foto && props.errors.foto ? (
                                            <div className=" ml-2 my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.foto}</p>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="flex">
                                        <div className="w-1/3">
                                            <div className="mb-4">
                                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="facebook">
                                                    Facebook
                                                </label>
                                                <input 
                                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="facebook"
                                                type= "text"
                                                placeholder="Facebook Empresa"
                                                onChange={props.handleChange}
                                                onBlur = {props.handleBlur}
                                                value = {props.values.facebook}
                                                />
                                            </div>
                                            
                                        </div>
                                        <div className="w-1/3 ml-2">
                                            <div className="mb-4">
                                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="instagram">
                                                    Instagram
                                                </label>
                                                <input 
                                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="instagram"
                                                type= "text"
                                                placeholder="Instagram Empresa"
                                                onChange={props.handleChange}
                                                onBlur = {props.handleBlur}
                                                value = {props.values.instagram}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-1/3 ml-2">
                                            <div className="mb-4">
                                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="whatsapp">
                                                    Whatsapp
                                                </label>
                                                <input 
                                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="whatsapp"
                                                type= "text"
                                                placeholder="Whatsapp Empresa"
                                                onChange={props.handleChange}
                                                onBlur = {props.handleBlur}
                                                value = {props.values.whatsapp}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <input type="submit" className="bg-gray-800  w-auto mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Actualizar datos"/>
                                    </div>
                                </form>            
                            </>
                        );
                    }}
                </Formik>
            </div>
        </div>
        
    );
}

export default EditaEmpresa;