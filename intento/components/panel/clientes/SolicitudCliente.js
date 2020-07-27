import React from 'react'
import {gql, useMutation} from '@apollo/client'
import Swal from 'sweetalert2';

const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente($id: ID!){
        eliminarCliente(id: $id)
    }
`;

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput ){
        actualizarCliente(id: $id, input: $input){
            nombre
            status
        }
    }
`;

const MANDAR_CORREO = gql`
    mutation correoEmpresa($input: CorreoInput){
        correoEmpresa(input: $input)
    }
`;

const SolicitudCliente = ({cliente}) =>{
    
    const {nombre,apellido,email,id,empresa} = cliente;
    const [correoEmpresa] = useMutation(MANDAR_CORREO);
    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE);
    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

    const confirmarEliminarCliente = () =>{
        Swal.fire({
            title: '¿Deseas elimiar a este cliente?',
            text: "Esta acción no se peude deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar'
          }).then(async(result) => {
            if (result.value) {
                try {
                    //elimianr por id
                    const {data} = await eliminarCliente({
                        variables:{
                            id
                        }
                    });
                    //console.log(data); 
                    //mostrar una alerta
                    Swal.fire(
                        'Eliminado',
                        data.eliminarCliente,
                        'success'
                      ) 
                } catch (error) {
                    console.log(error);
                }
              
            }
        })
    }

    const editarCliente = async () =>{
        try {
            const {data} = await actualizarCliente({
                variables:{
                    id,
                    input:{
                        status:"HABILITADO"
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
                        <p>Se le notifica sobre su aprobacion de acceso a
                        ${empresa.nombre} para continuar acceda al siguiente link</p>

                        <a href="http://localhost:3000/login/[pid]?id=${empresa.id}">Ingresa aqui!</a>
                        <p>psd el link no funciona ni lo intentes, pero ya te aceptamos</p>
                        <p>No responder a este mensaje</p>
                        </html>
                        
                           `
                    }
                }
            })
            await Swal.fire(
                'Listo',
                'El cliente fue agregado con exito',
                'success'
            )
        } catch (error) {
            console.log(errror);
        }
    }

    return( 
        <div className=" border-blue-500 m-2 border-t-4  bg-white rounded p-6  shadow-lgv xl:w-full sm:w-full">
            <div className="w-2/2">
                <p className=" font-bold text-gray-800 "> Cliente: {nombre} {apellido}</p>
                <p className="flex items-center my-2 ">
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    {email}
                </p>
            </div>
            <button type="button" className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>editarCliente()}>
                Agregar
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 ml-2" stroke="currentColor"><path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
            <button type="button" className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>confirmarEliminarCliente(id)}>
                Rechazar y Eliminar
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 ml-2"stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
        </div>
    )
}

export default SolicitudCliente;