import React,{useEffect,useState} from 'react'
import PedidoCita from './PedidoCita';
import {useQuery,gql,useMutation} from '@apollo/client';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import Swal from 'sweetalert2';
import Router from 'next/router';
const horarios = [
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

const estados =[
    {value: "PENDIENTE", label: "Pendiente"},
    {value: "CANCELADO", label: "Cancelado"}
]

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

const MANDAR_CORREO = gql`
    mutation correoEmpresa($input: CorreoInput){
        correoEmpresa(input: $input)
    }
`;

const ELIMINAR_CITA= gql`
    mutation eliminarPedido($id: ID!){
        eliminarPedido(id: $id)
    }
`;

const SolicitudCita = ({cita}) =>{
    const {cliente:{id:idcliente,nombre, apellido,email,telefono},pedido,total,fecha,estado,empresa,id} = cita;

    const fechacita = new Date(parseInt(fecha));
    let formatted_date =fechacita.getDate() + "/" +(fechacita.getMonth()+1) + "/" +fechacita.getFullYear();
    
    const [mensaje,setMensaje] = useState(null);


   


    const [actualizarPedido] = useMutation(ACTUALIZAR_CITA);
    const [correoEmpresa] = useMutation(MANDAR_CORREO);
    const [eliminarPedido] = useMutation(ELIMINAR_CITA);

    const formik = useFormik({
        initialValues:{
            fecha: '',
            hora: '',
            estado: ''
        },
        validationSchema:Yup.object({
            fecha: Yup.date().required('La fecha es necesaria'),
            hora: Yup.string().required('El cliente es necesario'),
            estado: Yup.string().required('Favor de ingresar el usuario que va a realizar el trabajo'),
            
        }),
        onSubmit: async valores =>{
            console.log(valores);
            Swal.fire(
                'Reagendado',
                'sas',
                'success'
              ) 
        }
    })

    const confirmarCita = async (id) =>{
        try {
           const {data} = await actualizarPedido({
               variables:{
                   id,
                   input:{
                       estado: "LISTADO",
                       cliente: idcliente
                   }
               }
           })
            const {data: datamensaje} = await correoEmpresa({
                variables:{
                    input:{
                        destinatario:email,
                        sujeto: `Solicitud aceptada a U3Citas`,
                        cuerpo: `
                        <html>
                        <h1>Estimado/a ${nombre} ${apellido}:</h1><br>
                        <p>Se le notifica que su solicitud de cita para ${formatted_date} ${fechacita.getHours()}:00 ha sido aceptada</p>
                        <p>Para reagendar la cita acceda a su perfil de U3Cita</p>
                        <a href="http://localhost:3000/login/[pid]?id=${empresa}">Ingresa aqui!</a>
                        <p>psd el link no funciona ni lo intentes, pero ya te aceptamos</p>
                        <p>No responder a este mensaje</p>
                        </html>
                        
                        `
                    }
                }
            }) 
            Swal.fire(
                'Agendado',
                'La cita se agendó correctamente',
                'success'
            )
        } catch (error) {
            setMensaje(error.message.replace('GraphQL error: ',''));
            setTimeout(() => {
                setMensaje(null);
            }, 3000);
        }
    }

    const mostrarmensaje = () =>{
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p >{mensaje}</p>
            </div>
        )
    }

    const confirmarEliminarCita = async (id) =>{
        Swal.fire({
            title: '¿Deseas eliminar esta cita?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then(async(result) => {
            if (result.value) {
                try {
                    const {data} = eliminarPedido({
                        variables:{
                            id
                        }
                    })
                    const {data: datamensaje} = await correoEmpresa({
                        variables:{
                            input:{
                                destinatario:email,
                                sujeto: `Solicitud Rechazada a U3Citas`,
                                cuerpo: `
                                <html>
                                <h1>Estimado/a ${nombre} ${apellido}:</h1><br>
                                <p>Se le notifica que su solicitud de cita para ${formatted_date} ${fechacita.getHours()}:00 ha sido rechazada</p>
                                <p>Para aclaraciones favor de ponerse en contacto con la empresa</p>
                                <p>Si desea agendar otra cita ingrese a su perfil de U3Citas</p>
                                <a href="http://localhost:3000/login/[pid]?id=${empresa}">Ingresa aqui!</a>
                                <p>psd el link no funciona ni lo intentes, pero ya te aceptamos</p>
                                <p>No responder a este mensaje</p>
                                </html>
                                
                                `
                            }
                        }
                    }) 
                    Swal.fire(
                        'Agendado',
                        'La cita se agendó correctamente',
                        'success'
                    )
                } catch (error) {
                    setMensaje(error.message.replace('GraphQL error: ',''));
                    setTimeout(() => {
                        setMensaje(null);
                    }, 3000);    
                }  
              
            }
        })
        
    }
    const editarCita = (id) =>{
        Router.push({
            pathname : "/controlpanel/reagendarsolicitud/[id]",
            query : {id}
        })
    } 
    return(
        <div className={`border-orange-600 m-2 border-t-4  bg-white rounded p-6  shadow-lgv xl:w-full sm:w-full`}>
            <p className=" font-bold text-gray-800 "> Cita para: {nombre} {apellido}</p>
            <p className="flex items-center my-2 ">
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                {email}
            </p>
            {telefono && (
                <p className="flex items-center my-2" >
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>  
                    {telefono}
                </p>
            )}
            <p className="flex items-center my-2" >
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>  
                {formatted_date}
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2 ml-2" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>  
                {fechacita.getHours()}:00
            </p>
            <p className=" font-bold text-gray-800 "> Servicios: </p>
            {
                pedido.map(producto =>(
                    <PedidoCita
                    key = {producto.id}
                    producto = {producto}
                    />
                ))
            }
            <p className=" font-bold text-gray-800 flex justify-end mr-5 "> Total: ${total}</p>
            {mensaje && mostrarmensaje()}
            <button type="button" className="flex justify-center  items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>confirmarCita(id)}>
                Agendar cita
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 ml-2"stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg>
            </button>
            <button type="button" className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>confirmarEliminarCita(id)}>
                Cancelar y eliminar
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 ml-2"stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
                <button type="button" className="flex justify-center  items-center bg-yellow-500 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>editarCita(id)}>
                    Editar y agendar    
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"  className="w-6 h-6 ml-2" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
        </div>
    )
}

export default SolicitudCita;