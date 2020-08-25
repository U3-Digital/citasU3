import React,{useState} from 'react'
import LayoutAdmin from '../../components/admin/LayoutAdmin';
import {useFormik, useField} from 'formik';
import * as Yup from 'yup';
import {gql, useMutation} from '@apollo/client'
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';

const options = [
    { value: 'HABILITADO', label: 'Habilitada' },
    { value: 'DESHABILITADO', label: 'Deshabilitada' }
]


const NUEVA_EMPRESA =gql`
    mutation nuevaEmpresa($input:  EmpresaInput){
        nuevaEmpresa(input: $input){
            id
            nombre
            direccion
            fotos
            email
            facebook
            instagram
            whatsapp
        }
    }
`;

const OBTENER_EMPRESAS = gql `
    query obtenerEmpresas{
        obtenerEmpresas{
            id
            nombre
            direccion
            fotos
            
        }
    }
`;


const NuevaEmpresa = () =>{
    const router = useRouter();
    const [statusState,setStatus] = useState([]);
    const [imagen ,setImagen] = useState("https://www.imor.es/wp-content/uploads/2017/09/imagen-de-prueba-320x240.jpg");
    //setImagen("https://www.imor.es/wp-content/uploads/2017/09/imagen-de-prueba-320x240.jpg");
    const [imagenload, setimagenload] = useState([])
 
    const [nuevaEmpresa] = useMutation(NUEVA_EMPRESA, {
        update(cache, {data:{nuevaEmpresa}}){
            //obtener el objeto de cache que deseamos actualizar
            const {obtenerEmpresas} = cache.readQuery({query: OBTENER_EMPRESAS});

            //reescribimos el cache (el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_EMPRESAS,
                data:{
                    obtenerEmpresas: [...obtenerEmpresas, nuevaEmpresa]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues:{
            nombre: '',
            direccion: '',
            email: '',
            foto: '',
            facebook: '',
            instagram: '',
            whatsapp: '',
            status: ''
        },
        validationSchema : Yup.object({
            nombre: Yup.string().required('El nombre de la empresa es obligatorio'),
            direccion : Yup.string().required('La direccion del negocio es necesaria'),
            email: Yup.string().required('El campo de email no puede estar vacio'),
            foto: Yup.mixed(),
            facebook: Yup.string(),
            instagram: Yup.string(),
            whatsapp: Yup.string(),
            status: Yup.string().required('El status es obligatorio')
        }),
        onSubmit: async valores =>{
            const {nombre, direccion, email, foto, facebook, instagram, whatsapp,status} = valores;
            try {
                const {data} = await nuevaEmpresa({
                    variables: {
                        input: {
                            nombre,
                            direccion,
                            email,
                            fotos: foto,
                            facebook,
                            instagram,
                            whatsapp,
                            status
                        }
                    }
                });
                //console.log(data);
                Swal.fire(
                    'Creado',
                    'Se creó la empresa correctamente',
                    'success'
                )
                router.push('/4dm1n/empresas');//redireccionar a empresas 
            } catch (error) {
                console.log(error);
            }
        }
    })

    const imageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () =>{
          if(reader.readyState === 2){
            setImagen(reader.result);
            setimagenload(e.target.files[0]);
          }
        }
        reader.readAsDataURL(e.target.files[0])
      };


    return(
        <LayoutAdmin>
            <h1 className="text-2xl text-gray-800 font-light">Nueva Empresa</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-4xl"> 
                   <form className=" bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
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

                                <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
                                        Direccion
                                    </label>
                                    <input 
                                    className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="direccion"
                                    type= "text"
                                    placeholder="Direccion Empresa"
                                    onChange={formik.handleChange}
                                    onBlur = {formik.handleBlur}
                                    value = {formik.values.direccion}
                                    />
                                </div>
                                
                                { formik.touched.direccion && formik.errors.direccion ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.direccion}</p>
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
                                <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                        Status
                                    </label>
                                    <Select
                                        id="status"
                                        options={options}
                                        placeholder="Status de la empresa"
                                        onChange={selectedOption => {
                                            formik.handleChange("status")(selectedOption.value);
                                            setStatus(selectedOption);
                                        }}
                                        value={statusState}
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
                            <div className="mb-4 w-1/2 ml-5">
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="foto">
                                    Foto
                                </label>
                                <img src={imagen}  className="justify center w-11 h-11" id="imgfoto"></img>
                                <input 
                                className=" shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="foto"
                                type= "file"
                                accept="image/*"
                                onChange={imagen =>{
                                    imageHandler(imagen);
                                    formik.handleChange("foto")(imagen);
                                    console.log(imagen.target.files[0]);
                                }}
                                onBlur = {formik.handleBlur}
                                value = {formik.values.foto}
                                />
                            </div>
                            
                            { formik.touched.foto && formik.errors.foto ? (
                                <div className=" ml-2 my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.foto}</p>
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
                                    onChange={formik.handleChange}
                                    onBlur = {formik.handleBlur}
                                    value = {formik.values.facebook}
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
                                    onChange={formik.handleChange}
                                    onBlur = {formik.handleBlur}
                                    value = {formik.values.instagram}
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
                                    onChange={formik.handleChange}
                                    onBlur = {formik.handleBlur}
                                    value = {formik.values.whatsapp}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <input type="submit" className="bg-gray-800  w-auto mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Registrar Empresa"/>
                        </div>
                    </form>
                </div>
            </div>
        </LayoutAdmin>
    );
}

export default NuevaEmpresa;