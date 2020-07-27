import React,{useState} from 'react'
import {useQuery, useMutation, gql} from '@apollo/client';
import PedidoCita from './PedidoCita';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import Select from 'react-select';
import {useRouter} from 'next/router';
const OBTENER_CITA = gql`
    query obtenerPedido($id: ID!){
        obtenerPedido(id: $id){
            id
            pedido{
            id
            nombre
            precio
            }
            total
            cliente{
            id
            nombre
            apellido
            email
            telefono
            }
            empresa
            fecha
            estado
        }
    }
`;

const ACTUALIZAR_CITA = gql`
    mutation actualizarPedido($id: ID!, $input:  PedidoInput ){
        actualizarPedido(id: $id, input: $input){
            id
            pedido{
            id
            nombre
            precio
            }
            total
            fecha
            estado
        }
    }
`;

const opcionesestado = [
    { value: 'CANCELADO', label: 'Cancelado' },
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'LISTADO', label: 'Agendado'}
]

const opcionesHora = [
    { value: '8:00', label: '8:00' },
    { value: '9:00', label: '9:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '12:00', label: '12:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
    { value: '17:00', label: '17:00' },
    { value: '18:00', label: '18:00' },
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' }
]


const MANDAR_CORREO = gql`
    mutation correoEmpresa($input: CorreoInput){
        correoEmpresa(input: $input)
    }
`;

const EditarSolicitud = ({id}) =>{
    const router = useRouter();
    const [hora,setHora] = useState(null);
    const [estadocita,setEstado] = useState(null);
    const yesterday = new Date(Date.now() -86400000);
    const [mensaje,setMensaje] = useState(null);
    const [actualizarPedido] = useMutation(ACTUALIZAR_CITA);
    const [correoEmpresa] = useMutation(MANDAR_CORREO);

    const schemaValidacion = Yup.object({
        dia: Yup.date().min(yesterday,"ingresar una fecha valida"),
        hora: Yup.string(),
        estado: Yup.string().required('el estado es obligatorio')
    })

    const {data,loading,error} = useQuery(OBTENER_CITA,{
        variables:{
            id
        }
    });

    if(loading) return 'Cargando...';

    const {fecha,estado,pedido,total,empresa,cliente:{id:idcliente,nombre,apellido,email,telefono}} = data.obtenerPedido;

    if(estadocita === null){
        if(estado === "PENDIENTE"){
            setEstado({ value: 'PENDIENTE', label: 'Pendiente' })
        } if(estado === "LISTADO"){
            setEstado({ value: 'LISTADO', label: 'Agendado'}) 
        }else{
            setEstado({ value: 'CANCELADO', label: 'Cancelado' })
        }
    }
    

    const fechacita = new Date(parseInt(fecha));
    let formatted_date = fechacita.getFullYear()+ "-0" +(fechacita.getMonth()+1) + "-" +fechacita.getDate() ;
    
    if((fechacita.getMonth()+1).toString().length === 2){
        formatted_date = fechacita.getFullYear()+ "-" +(fechacita.getMonth()+1) + "-" +fechacita.getDate() ;    
    }
    if(hora === null){
        setHora({value:`${fechacita.getHours()}:00`, label:`${fechacita.getHours()}:00`})
    }
    
    const valuesinitial = {
        hora: `${fechacita.getHours()}:00`,
        dia: formatted_date,
        estado: estado
    }

    const mostrarmensaje = () =>{
        return(
            <div className = "bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    } 
    const acatualizahorario = async (valores) =>{
        console.log(valores)
        const {dia,estado: nuevoestado,hora} = valores;
        const nuevafechacita= `${dia};${hora}`;
        console.log(nuevafechacita)

        

        try {
            const {data} = await actualizarPedido({
                variables:{
                    id,
                    input:{
                        estado: nuevoestado,
                        fecha: nuevafechacita,
                        cliente: idcliente
                    }
                }
            })
             const {data: datamensaje} = await correoEmpresa({
                 variables:{
                     input:{
                         destinatario:email,
                         sujeto: `Solicitud de cita modificada a U3Citas`,
                         cuerpo: `
                         <html>
                         <h1>Estimado/a ${nombre} ${apellido}:</h1><br>
                         <p>Se le notifica que su solicitud de cita para ${formatted_date} ${fechacita.getHours()}:00 ha sido modificada</p>
                         <p> Los nuevos datos de su cita son:</p>
                         <p>Fecha: ${dia} ${hora}</p>
                         <p>Estado de la cita: ${estadocita.label} </p>
                         <p>Para reagendar la cita acceda a su perfil de U3Citas</p>
                         <a href="http://localhost:3000/login/[pid]?id=${empresa}">Ingresa aqui!</a>
                         <p>psd el link no funciona ni lo intentes, pero ya te aceptamos</p>
                         <p>No responder a este mensaje</p>
                         </html>
                         
                         `
                     }
                 }
             }) 
             Swal.fire(
                 'Modificado',
                 'La cita se modificó correctamente',
                 'success'
             )
             router.push('/controlpanel/citas');         
         } catch (error) {
             setMensaje(error.message.replace('GraphQL error: ',''));
             setTimeout(() => {
                 setMensaje(null);
             }, 3000);
         }
    }

    return(
        <>
            <div className="xl:flex  mt-5">
                <div className="xl:w-1/4 ">
                <h1 className="text-xl text-black font-mono">Info cliente: </h1>
                <p className="flex items-center my-2 font-mono text-gray-800 ">
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                    {nombre} {apellido}
                </p>
                <p className="flex items-center my-2 font-mono text-gray-800 ">
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    {email}
                </p>
                {telefono && (
                    <p className="flex items-center my-2 font-mono text-gray-800" >
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>  
                        {telefono}
                    </p>
                )}
                <div className="font-mono text-gray-800 mt-5">
                    <h1 className="text-xl text-black font-mono">Servicios: </h1>
                    {
                        pedido.map(producto =>(
                            <PedidoCita
                            
                            key = {producto.id}
                            producto = {producto}
                            />
                        ))
                    }
                </div>
                </div>
                <div className="xl:ml-10 xl:w-3/4 xl:mr-10 ">
                    <h1 className="text-xl text-black font-mono">Horario de la cita: </h1>
                    <Formik
                        validationSchema={schemaValidacion}
                        enableReinitialize
                        initialValues={valuesinitial}
                        onSubmit= { (valores, fuciones) =>{
                            acatualizahorario(valores);
                        }}
                    >
                        {props =>{
                            return(
                                <form onSubmit={props.handleSubmit}>
                                    <div className="mb-4">
                                        <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="dia">
                                            Fecha
                                        </label>
                                        <input 
                                        className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="dia"
                                        type= "date"
                                        onChange={props.handleChange}
                                        onBlur = {props.handleBlur}
                                        value = {props.values.dia}
                                        />
                                    </div>
                                    { props.touched.dia && props.errors.dia ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.dia}</p>
                                        </div>
                                    ) : null}
                                            <div className="mb-4 ">
                                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="hora">
                                                    Hora
                                                </label>
                                                <Select
                                                    className="mt-3" 
                                                    options={opcionesHora}
                                                    onChange={selectedOption => {
                                                        props.handleChange("hora")(selectedOption.value);
                                                        setHora(selectedOption);
                                                    }}
                                                    value={hora}
                                                    placeholder= "Seleccione el Horario"
                                                    noOptionsMessage= {() =>"No hay resultados"}
                                                />
                                            </div>
                                            
                                            { props.touched.hora && props.errors.hora ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error</p>
                                                    <p>{props.errors.hora}</p>
                                                </div>
                                            ) : null}
                                            <div className="mb-4">
                                                <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                                                    Estado
                                                </label>
                                                <Select
                                                    className="mt-3" 
                                                    options={opcionesestado}
                                                    onChange={selectedOption => {
                                                        props.handleChange("estado")(selectedOption.value);
                                                        setEstado(selectedOption);
                                                    }}
                                                    value={estadocita}
                                                    placeholder= "Seleccione el estado de la cita"
                                                    noOptionsMessage= {() =>"No hay resultados"}
                                                />
                                            </div>
                                            
                                            { props.touched.estado && props.errors.estado ? (
                                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                    <p className="font-bold">Error</p>
                                                    <p>{props.errors.estado}</p>
                                                </div>
                                            ) : null}
                                        
                                    {mensaje && mostrarmensaje()}
                                    <div className="flex justify-end">
                                        <input type="submit" className="bg-gray-800 mb-0 w-auto mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Reagendar y aceptar"/>
                                    </div>
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </>
    )
}

export default EditarSolicitud;