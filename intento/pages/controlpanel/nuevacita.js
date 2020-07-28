import React, { useContext, useState } from 'react'
import LayoutUsuarios from '../../components/panel/LayoutUsuarios';
import AsignarCliente from '../../components/pedidos/AsignarCliente';
import AsignarUsuario from '../../components/pedidos/AsignarUsuario';
import AsignarFecha from '../../components/pedidos/AsignarFecha';
import AsignarHora from '../../components/pedidos/AsignarHora';
//Context de pedidos
import PedidoContext from '../../context/pedidos/PedidoContext';
import AsignarProductos from '../../components/pedidos/AsignarProductos';
import ResumenPedido from '../../components/pedidos/ResumenPedido';
import Total from '../../components/pedidos/Total';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';


const MANDAR_CORREO = gql `
    mutation correoEmpresa($input: CorreoInput){
        correoEmpresa(input: $input)
    }
`;

const NUEVA_CITA = gql `
    mutation nuevoPedido($input : PedidoInput){
        nuevoPedido(input: $input){
            id
            pedido{
            nombre
            precio
            }
            total
            cliente{
            nombre
            email
            }
            empleado{
            nombre
            email
            }
            fecha
            estado
        }  
    }
`;


const NuevoPedido = () => {
    const today = new Date(Date.now());
    const router = useRouter();
    const [mensaje, setMensaje] = useState(null);
    //Utilizar el context y exptraer sus valores y funciones 
    const pedidocontext = useContext(PedidoContext);
    const { cliente, usuario, fecha, hora, productos, total } = pedidocontext;




    //Mutation para crear un nuevo pedido
    const [nuevoPedido] = useMutation(NUEVA_CITA);
    const [correoEmpresa] = useMutation(MANDAR_CORREO);
    const validarPedido = () => {
        return !productos.every(producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? "opacity-50 cursor-not-allowed" : "";
    }

    const crearNuevoPedido = async() => {
        const { id: idcliente, email: emailCliente, nombre: nombreCliente, apellido: apellidoCliente, empresa: empresaCliente } = cliente;
        const { id: idusuario, nombre: nombreUsuario, apellido: apellidoUsuario } = usuario;
        const fechacita = `${fecha};${hora}:00`;

        //console.log(idcliente);
        if (new Date(fechacita) < today) {
            setMensaje("La fecha es invalida");
            setTimeout(() => {
                setMensaje(null);
            }, 3000);
        } else if (new Date(fechacita) < (today + 14400000)) {
            setMensaje("El horario no puede ser a menos de 4 horas de la hora actual");
            setTimeout(() => {
                setMensaje(null);
            }, 3000);
        } else {

            //remover lo no deseado de productos
            const pedido = productos.map(({ __typename, cantidad, ...producto }) => producto)

            try {
                const { data } = await nuevoPedido({
                    variables: {
                        input: {
                            cliente: idcliente,
                            empleado: idusuario,
                            fecha: fechacita,
                            total,
                            pedido,
                            estado: "LISTADO"
                        }

                    }
                });
                const { data: datamensaje } = await correoEmpresa({
                        variables: {
                            input: {
                                destinatario: emailCliente,
                                sujeto: `U3Citas cita agendada`,
                                cuerpo: `
                            <html>
                            <h1>Estimado/a ${nombreCliente} ${apellidoCliente}:</h1><br>
                            <p>Cita agendada para: ${fecha} ${hora} </p>
                            <p>Le atendera: ${nombreUsuario} ${apellidoUsuario}</p>

                            <p>mas detalles en tu perfil de U3citas</p>

                            <a href="http://localhost:3000/login/[pid]?id=${empresaCliente}">Ingresa aqui!</a>
                            <p>psd el link no funciona ni lo intentes, pero ya te agendamos la cita, tu confia</p>
                            <p>No responder a este mensaje</p>
                            </html>
                            
                            `
                            }
                        }
                    })
                    //redireccionar 
                router.push('/controlpanel/citas');
                //mostrar aletrta
                Swal.fire(
                    'Correcto',
                    'La cita se registró correctamente',
                    'success'
                )
            } catch (error) {
                setMensaje(error.message.replace('GraphQL error: ', ''));
                setTimeout(() => {
                    setMensaje(null);
                }, 3000);
            }
        }
    }

    const mostrarmensaje = () => {
        return ( <
            div className = "bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto" >
            <
            p > { mensaje } < /p> <
            /div>
        )
    }

    return ( <
        LayoutUsuarios >

        <
        h1 className = "text-2xl text-gray-800 font-light" > Nuevo Pedido < /h1>

        { mensaje && mostrarmensaje() }

        <
        div className = "flex justify-center mt-5" >
        <
        div className = " w-full max-w-lg" >
        <
        AsignarCliente / >
        <
        AsignarUsuario / >
        <
        AsignarFecha / >
        <
        AsignarHora / >
        <
        AsignarProductos / >
        <
        ResumenPedido / >
        <
        Total / > { mensaje && mostrarmensaje() } <
        button type = "button"
        className = { ` bg-gray-800 w-full  mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}` }
        onClick = {
            () => crearNuevoPedido() } >
        Registrar Cita < /button> <
        /div>

        <
        /div>

        <
        /LayoutUsuarios>
    )
}

export default NuevoPedido;