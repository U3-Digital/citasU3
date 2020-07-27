import React,{useState,useContext,useEffect} from 'react'
import {useQuery, useMutation, gql} from '@apollo/client';
import Swal from 'sweetalert2';
import {useRouter} from 'next/router';
import TablaProximaCita from '../../../components/panel/citas/TablaProximaCita';
import  PedidoContext from '../../../context/pedidos/PedidoContext';

//componentes
import AsignarServicios from './servicios/AsignarServicios';
import PedidoResumen from './servicios/PedidoResumen';
import Total from './servicios/Total';
import AsignarCupon from './servicios/AsignarCupon';
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

const MANDAR_CORREO = gql`
    mutation correoEmpresa($input: CorreoInput){
        correoEmpresa(input: $input)
    }
`;



const FormCompletar = ({id}) =>{
    const router = useRouter();
    const [consulta,setConsulta] = useState(false)
    const [mensaje,setMensaje] = useState(null);
    const [productos, setproductos] = useState([])
    const [actualizarPedido] = useMutation(ACTUALIZAR_CITA);
    const [correoEmpresa] = useMutation(MANDAR_CORREO);
    const pedidocontext = useContext(PedidoContext);
    const {total: totalState,productos: productosState,cupon,agregarProducto} = pedidocontext;

    const {data,loading,error} = useQuery(OBTENER_CITA,{
        variables:{
            id
        }
    });

    useEffect(() =>{
        //TODO: Funcion para pasar a pedido state
        agregarProducto(productos);
    },[productos])

    if(loading) return 'Cargando...';

    const {fecha,estado,pedido,total,empresa,cliente:{id:idcliente,nombre,apellido,email,telefono}} = data.obtenerPedido;

    const fechacita = new Date(parseInt(fecha));
    let formatted_date =fechacita.getDate() + "/" +(fechacita.getMonth()+1) + "/" +fechacita.getFullYear();
    

    

    if(consulta === false){
        setproductos(pedido);
        setConsulta(true)
    }


    const mostrarmensaje = () =>{
        return(
            <div className = "bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    } 

    const aceptarDatos =() =>{
        const nuevoTotal = totalState-(totalState*(cupon.descuento/100));

        const pedido = productosState.map(({__typename,cantidad,...producto})=>producto)
        
         Swal.fire({
            title: '¿Deseas completar la cita?',
            text: "Ya no podras modificarla",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, completar',
            cancelButtonText: 'No, cancelar'
        }).then(async(result) => {
            if (result.value) {
                try {
                    const {data} = await actualizarPedido({
                        variables:{
                            id,
                            input:{
                                estado: 'COMPLETADO',
                                pedido,
                                cliente: idcliente,
                                total: Number(nuevoTotal),
                                cupon: cupon.id
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
                                <p>Gracias por usar nuestro servicio </p>
                                <p>Cita completada</p>
                                <p>cita para ${formatted_date}</p>
                                <p>Con un total de : ${nuevoTotal} </p>
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
        })

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
                    <h1 className="text-xl text-black font-mono">Horario Cita: </h1>
                    <p className="flex items-center my-2" >
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>  
                        {formatted_date}
                    </p>
                    <p className="flex items-center my-2" >
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2 " stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>  
                        {fechacita.getHours()}:00
                    </p>
                </div>
                <div className="font-mono text-gray-800 mt-5">
                    <div className="h-full">
                        <TablaProximaCita
                            id ={idcliente}
                        />
                    </div>
                </div>
                </div>
                <div className="xl:border-l-2 border-dashed border-gray-600 w-full xl:mr-3 xl:ml-2">
                    <h1 className="text-xl text-black font-mono xl:ml-2 ">Datos de servicios: </h1>         
                    <AsignarServicios/>
                    <PedidoResumen/>
                    <div className="xl:flex justify-between">
                        <AsignarCupon/>
                        <div>
                            <Total/>
                            {cupon.descuento !== 0 && cupon !== {} ? (
                                <>
                                    <p className="flex justify-end items-center my-2" >
                                        Descuento: {cupon.descuento}%
                                    </p>
                                    <p className=" font-bold text-gray-800 flex justify-end  text-lg">
                                        Total a pagar: ${totalState-(totalState*(cupon.descuento/100))}
                                    </p>
                                </>
                            ) : (
                                null
                            )

                            }
                        </div>
                    </div>
                    {mensaje && mostrarmensaje()}
                    <div className="xl:flex justify-end ">
                        <button type="button" className="flex justify-center mr-2 items-center bg-blue-600 py-2 px-4 xl:w-1/3 text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>aceptarDatos()}>
                            <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 mr-2"stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg>
                            Completar y Guardar
                        </button>
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default FormCompletar;