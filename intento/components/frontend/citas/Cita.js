import React,{useEffect,useState} from 'react'
import PedidoCita from './PedidoCita';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Router, { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import {useQuery,gql,useMutation} from '@apollo/client';


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
            cupon{
                nombre
            }
        }
    }
`;

const MANDAR_CORREO = gql`
    mutation correoEmpresa($input: CorreoInput){
        correoEmpresa(input: $input)
    }
`;


const Cita = ({cita}) =>{
    const router = useRouter();
    const {cliente:{id: idcliente,nombre, apellido,email},empresa:{nombre:nombreEmpresa},pedido,id,total,fecha,estado,empresa,cupon} = cita;

    const fechacita = new Date(parseInt(fecha));
    let formatted_date =fechacita.getDate() + "/" +(fechacita.getMonth()+1) + "/" +fechacita.getFullYear();


    if(fechacita < Date.now()){
        console.log(`${total} ya se pasó`);
    }

    const [correoEmpresa] = useMutation(MANDAR_CORREO);
    const [actualizarPedido] = useMutation(ACTUALIZAR_CITA);

    const [estadoPedido, setEstadoPedido]= useState(estado);
    const [clase, setClase]= useState('');
    const [form, setForm] = useState('hidden');
    const [hora,sethora] = useState('');
    const [mensaje,setMensaje] = useState(null);
    const [nuevoestado, setEstado] = useState('');
    useEffect(() =>{
        if(estadoPedido){
            setEstadoPedido(estadoPedido)
        }
        clasePedido();
    },[estadoPedido]);
    //Funcion que modifica el color del pedido de acurdo a su estado
    const clasePedido = () =>{
        if(estadoPedido ==='LISTADO'){
            setClase('border-yellow-500')
        }else if(estadoPedido === 'COMPLETADO'){
            setClase('border-green-500')
        }else{
            setClase('border-red-800')
        }
    }

    const cancelarCita = async () =>{
        Swal.fire({
            title: '¿Deseas cancelar esta cita?',
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
                    const {data} = await actualizarPedido({
                        variables:{
                            id,
                            input:{
                             estado:"CANCELADO",
                             cliente: idcliente
                            }
                        }
                    }); 
                    console.log(data);
                     //mostrar aletrta
                     Swal.fire(
                         'Correcto',
                         'La cita se cancelo correctamente',
                         'success'
                    )
                    } catch (error) {
                        setMensaje(error.message.replace('GraphQL error: ',''));
                        setTimeout(() => {
                            setMensaje(null);
                        }, 3000);           
                    }
            }
        });



        
       
    }

    const editarCita = (id) =>{
        Router.push({
            pathname : "/reagendarcita/[id]",
            query : {id}
        })
    } 

    const confirmarEliminarCita = (id) =>{
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
                                <p>Se le notifica que su solicitud de cita para ${formatted_date} ${fechacita.getHours()}:00 ha sido Cancelada</p>
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

    const mostrarmensaje = () =>{
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p >{mensaje}</p>
            </div>
        )
    }

    return(
        <div className={`${clase} m-2 border-t-4  bg-white rounded p-6  shadow-lgv xl:w-full sm:w-full`}>
            <p className=" font-bold text-gray-800 "> Cita para: {nombre} {apellido}</p>
            <p className="flex items-center my-2 ">
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                {email}
            </p>
            <p className="flex items-center my-2" >
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>  
                {formatted_date}
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2 ml-2" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>  
                {fechacita.getHours()}:00
            </p>
            <p className="flex items-center my-2">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="bookmark w-4 h-4 mr-2"><path strokelinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                {nombreEmpresa}
            </p>
            {fechacita < Date.now()  && estadoPedido ==="LISTADO"?(
                <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                    <p >Esta cita esta vencida</p>
                </div>    
            ):(
                null
            )}

            <p className=" font-bold text-gray-800 "> Servicios: </p>
            {
                pedido.map(producto =>(
                    <PedidoCita
                    key = {producto.id}
                    producto = {producto}
                    />
                ))

                
            }
            {
                cupon ?(
                    <p className=" flex text-gray-800 ">
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 mr-2" stroke="currentColor"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                    {cupon.nombre}
                </p>
                ) :(
                    null
                )
            }
            <p className=" font-bold text-gray-800 flex justify-end mr-5 "> Total: ${total}</p>
            {mensaje && mostrarmensaje()}

            {estadoPedido ==='LISTADO' ? (
                <div className="flex">
                    <button type="button" className="flex justify-center items-center bg-red-800 py-2 px-4 w-1/2 text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>cancelarCita()}>
                        Cancelar
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 ml-2"stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </button>
                    <button type="button" className="flex justify-center ml-2 items-center bg-blue-400 py-2 px-4 w-1/2 text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>editarCita(id)}>
                        Reagendar
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"  className="w-6 h-6 ml-2" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                </div>
            ) :(
                null
            )

            }
            
            
        </div>
    )
}

export default Cita;