import React from 'react'
import {gql, useMutation} from '@apollo/client';
import Swal from 'sweetalert2';
import Router from 'next/router';


const ELIMINAR_USUARIO = gql`
    mutation eliminarUsuario($id: ID!){
        eliminarUsuario(id: $id)
    }
`;


const OBTENER_USUARIOS = gql `
    query obtenerUsuarios{
        obtenerUsuarios{
            nombre
            apellido
            id
            email
            telefono
            status
            rol
        }
    }

`;

const Usuario = ({usuario}) =>{
    const {id,nombre,apellido,email,telefono,rol,status,} = usuario;
    
    const [eliminarUsuario]=useMutation(ELIMINAR_USUARIO,{
        update(cache){
            //obtener una copia del objeto de cache
            const {obtenerUsuarios} = cache.readQuery({query: OBTENER_USUARIOS});
            //Reescribir el cache
            cache.writeQuery({
                query: OBTENER_USUARIOS,
                data:{
                    obtenerUsuarios: obtenerUsuarios.filter(usuarioActual => usuarioActual.id !== id)
                }
            })
        }
    })

    const confirmarEliminarUsuario = id =>{
        Swal.fire({
            title: '¿Deseas elimiar a este Usuario?',
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
                    const {data} = await eliminarUsuario({
                        variables:{
                            id
                        }
                    });
                    //console.log(data); 
                    //mostrar una alerta
                    Swal.fire(
                        'Eliminado',
                        data.eliminarUsuario,
                        'success'
                      ) 
                } catch (error) {
                    console.log(error);
                }
              
            }
          })
    }

    const editarUsuario = () =>{
        Router.push({
            pathname:"/controlpanel/editarusuario/[id]",
            query: {id}
        })
    }

    return(
        <div className=" border-blue-500 m-2 border-t-4  bg-white rounded p-6  shadow-lgv xl:w-full sm:w-full">
            <div className="w-2/2">
                <p className=" font-bold text-gray-800 "> Usuario: {nombre} {apellido}</p>
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
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    {status}
                </p>
                <p className="flex items-center my-2" >
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {rol}
                </p>
                <button type="button" className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>editarUsuario()}>
                    Editar
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"  className="w-6 h-6 ml-2" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                {rol !== "ADMINISTRADOR" ? (
                    <button type="button" className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>confirmarEliminarUsuario(id)}>
                        Eliminar
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 ml-2"stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </button> 
                ) : (
                    null
                )
                }
            </div>
        </div>
    )
}

export default Usuario;