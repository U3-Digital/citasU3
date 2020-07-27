import React, {useState} from 'react'
import Layout from '../../components/Layout'
import {useFormik, Formik} from 'formik';
import * as Yup from 'yup';
import {useRouter} from 'next/router';
import { gql, useMutation, useQuery } from '@apollo/client'
import Link from 'next/link';

const AUTENTICAR_CLIENTE = gql`
    mutation autenticarCliente($input: AutenticarClienteInput){
		autenticarCliente(input: $input){
    	token
        }
    }
`;

const OBTENER_EMPRESA = gql`
    query obtenerEmpresa($id: ID!){
        obtenerEmpresa(id: $id){
            nombre
        }  
    }
`;

const Login = () =>{
    
   


    //routing
    const router = useRouter();
    const { query: {id}} = router;
    const [mensaje,guardarMensaje] = useState(null);

    
    //Mutation para crear nuevos usuarios en apollo
    const [autenticarCliente] = useMutation(AUTENTICAR_CLIENTE);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('El email no es válido').required('El email no puede ir vacio'),
            password: Yup.string().required('El password es obligatorio')
        }),
        onSubmit : async valores =>{
            const {email, password} = valores;
            //console.log(valores);
            try {
                const{data} = await autenticarCliente({
                    variables:{
                        input: {
                            email,
                            password,
                            empresa: id
                        }
                    }
                });

                //console.log(data);
                guardarMensaje('Autenticando...')

                //Guardar el token en local storage
                
                setTimeout(() => {
                    const {token} = data.autenticarCliente;
                    localStorage.setItem('token',token);
                }, 200);
                

                //redireccionar hacia clientes

                setTimeout(() => {
                    guardarMensaje(null);
                    router.push('/');
                }, 1500);

                
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQl error: ',''));
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
                //console.log(error)
            }
        }
    });

    const mostrarmensaje = () =>{
        return(
            <div className = "bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    } 



    const {data,loading,error} = useQuery(OBTENER_EMPRESA,{
        variables:{
            id
        }
    });

    if(loading) return 'cargando...';
    const redireccionar = () =>{
        router.push({
            pathname : "/nuevacuenta/[id]",
            query : {id}
        })
    }

    //console.log(data);
    return(
        <Layout>

        <h1 className="text-center text-2xl text-white font-light mb-2">Login </h1>
        <p className="text-sm text-center text-white font-light mb-0">{data.obtenerEmpresa.nombre}</p>
        {mensaje && mostrarmensaje()}
        <div className="flex justify-center mt-5">
            <div className="w-full max-w-sm">
                <form
                    className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                    onSubmit= {formik.handleSubmit}
                >
                    <div className="mb-4">
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
                    <div className="mb-4">
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
                    <input
                    type ="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                    value="Iniciar Sesión"
                    />
                </form>
                <div className="absolute inset-x-0 text-center py-2 bottom-0 h-autos text-gray-300">
                        <p>¿Aún no tines cuenta
                            <span>
                            <button type="button" className="hover:text-white" onClick={() =>redireccionar()}>
                                {`? Registrate aqui`}                 
                            </button>
                                
                            </span>
                        </p>
                </div>
                
                
            </div>
        </div>
        </Layout>
    );
}

export default Login;