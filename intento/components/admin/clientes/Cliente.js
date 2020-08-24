import React from 'react'
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import Router from 'next/router';


const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente($id: ID!){
        eliminarCliente(id: $id)
    }
`;

const OBTENER_CLIENTES = gql `
    query obtenerClientes{
        obtenerClientes{
            id
            nombre
            apellido
            email
            empresa{
                nombre
            }
        }
    }
`;


const Cliente = ({cliente}) =>{
    const {id,nombre, apellido, email, status} = cliente;
    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE,{
        update(cache){
            //obtener una copia del objeto de cache
            const {obtenerClientes} = cache.readQuery({query: OBTENER_CLIENTES});
            //Reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTES,
                data:{
                    obtenerClientes: obtenerClientes.filter(clienteActual => clienteActual.id !== id)
                }
            })
        }
    })


    const confirmarEliminarCliente = id =>{
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

    const editarCliente = () =>{
        Router.push({
            pathname:"/4dm1n/editarcliente/[id]",
            query: {id}
        })
    }

    return (
        <tr >
            <td className="border px-4 py-2">{nombre} {apellido}</td>
            <td className="border px-4 py-2">{email}</td>
            <td className="border px-4 py-2">{status}</td>
            <td className="border px-4 py-2">
                <button type="button" className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold" onClick={() =>confirmarEliminarCliente(id)}>
                    Eliminar
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 ml-2"stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </td>
            <td className="border px-4 py-2">
                <button type="button" className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold" onClick={() =>editarCliente()}>
                    Editar
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"  className="w-6 h-6 ml-2" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
            </td>
        </tr>
    )
}
export default Cliente;