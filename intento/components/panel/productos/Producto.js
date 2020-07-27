import React from 'react'
import {gql, useQuery, useMutation} from '@apollo/client';
import Swal from 'sweetalert2';
import Router from 'next/router';

const ELIMINA_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!){
        eliminarProducto(id: $id)
    }
`;

const OBTENER_PRODUCTOS = gql`
    query obtenerProductosEmpresa{
        obtenerProductosEmpresa{
            id
            nombre
            precio
        }
    }          
`;

const Producto = ({producto}) =>{
    const {id,nombre,precio} = producto;

    const [eliminarProducto] = useMutation(ELIMINA_PRODUCTO,{
        update(cache){
            //obtener una copia del objeto de cache
            const {obtenerProductosEmpresa} = cache.readQuery({query: OBTENER_PRODUCTOS});
            //Reescribir el cache
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data:{
                    obtenerProductosEmpresa: obtenerProductosEmpresa.filter(productoActual => productoActual.id !== id)
                }
            })
        }
    });

    const confirmarEliminarProducto = (id) => {
        Swal.fire({
            title: '¿Deseas eliminar a este producto?',
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
                    //elimianr por id
                    const {data} = await eliminarProducto({
                        variables:{
                            id
                        }
                    });
                    
                    //mostrar una alerta
                    Swal.fire(
                        'Eliminado',
                        data.eliminarProducto,
                        'success'
                      ) 
                } catch (error) {
                    console.log(error);
                }
              
            }
        })
    }
    const editarCliente =() =>{
        Router.push({
            pathname : "/controlpanel/editarproducto/[id]",
            query : {id}
        })
    }
    return(
        
        <div className=" border-blue-500 m-2 border-t-4  bg-white rounded p-6  shadow-lgv xl:w-full sm:w-full">
            <div className="w-2/2">
                <p className=" flex font-bold text-gray-800 ">
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 mr-2" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Producto: {nombre}
                </p>
                <p className="flex items-center my-2 ">
                   Precio: ${precio}
                </p>
                <button type="button" className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>editarCliente()}>
                    Editar
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"  className="w-6 h-6 ml-2" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button type="button" className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>confirmarEliminarProducto(id)}>
                    Eliminar
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 ml-2"stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </div>
        </div>
    )
}

export default Producto