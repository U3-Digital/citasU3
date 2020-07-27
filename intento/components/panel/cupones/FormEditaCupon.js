import React, {useState} from 'react'
import {useQuery, gql , useMutation} from '@apollo/client';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';

const OBTENER_CUPON = gql`
    query obtenerUnCupon($id: ID!){
        obtenerUnCupon(id: $id){
            nombre
            vigencia
            descuento
            id
        }
    }
`;
const FormEditaCupon = ({id}) =>{

    const [calendario, setCalendario] = useState(null);

    const router = useRouter();
    const {data,loading,error} = useQuery(OBTENER_CUPON,{
        variables:{
            id
        }
    })

    if(loading) return('Cargando...');


    


    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre del producto es obligatorio'),
        descuento: Yup.number('El precio debe de ser un digito').required('El precio es obligatorio').positive("El precio debe de ser positivo").max(100,"El descuento maximo puede ser del 100%"),
        vigencia: Yup.date().required('La fecha de vencimiento es necesaria')
    })

    const actualizaInfoCupon = async (valores) =>{
        console.log(valores);
    }

    

    const {obtenerUnCupon} = data;
     

    const fecha = new Date(parseInt(obtenerUnCupon.vigencia));
    let month = "";
    if(fecha.getMonth().toString().length === 1){
        month = "0"+fecha.getMonth();
    }else{
        month = fecha.getMonth();
    }
    let formatted_date = fecha.getFullYear()+ "-" + month + "-" +fecha.getDate() ;
    
    if(calendario === null){
        setCalendario(fecha.getFullYear()+ "-" + month + "-" +fecha.getDate());
    }
    


    return(
        <Formik
            validationSchema={schemaValidacion}
            enableReinitialize
            initialValues={obtenerUnCupon}
            onSubmit= { (valores, fuciones) =>{
                actualizaInfoCupon(valores);
            }}
        >
            {props =>{
                return(
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>     
                        <div className="mb-4">
                            <div>
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre"
                                type= "text"
                                placeholder="Nombre Producto"
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
                        <div className="mb-4">
                            <div >
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="descuento">
                                    Descuento
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="descuento"
                                type= "number"
                                placeholder="descuento"
                                onChange={props.handleChange}
                                onBlur = {props.handleBlur}
                                value = {props.values.descuento}
                                />
                            </div>

                            { props.touched.descuento && props.errors.descuento ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.descuento}</p>
                                </div>
                            ) : null}
                        </div>
                        <div className="mb-4">
                            <div >
                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="vigencia">
                                    Fecha de vencimiento
                                </label>
                                <input 
                                className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="vigencia"
                                type= "date"
                                
                                onChange={selectedOption => {
                                    props.handleChange("vigencia")(selectedOption);
                                    setCalendario(selectedOption);
                                }}
                                onBlur = {props.handleBlur}
                                value = {calendario}
                                />
                            </div>

                            { props.touched.vigencia && props.errors.vigencia ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.vigencia}</p>
                                </div>
                            ) : null}
                        </div>
                        
                        <input type="submit" className="bg-gray-800  w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Actualizar Cupon"/>
                         
                    </form>
                )
            }}
        </Formik>
    )
}

export default FormEditaCupon;
