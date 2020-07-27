import React from 'react'
import Swal from 'sweetalert2';
import {gql,useMutation} from '@apollo/client'
import Router from 'next/router';
const OBTENER_PRODUCTOS = gql`
  query obtenerProductos{
    obtenerProductos{
      id
      nombre
      precio
      existencia
    }
  }
`;


const ELIMINAR_PRODUCTO = gql `
    mutation eliminarProducto($id: ID!){
        eliminarProducto(id: $id)
    }
`;


const Producto = ({producto}) =>{
    const {nombre, precio,existencia, id} = producto

    //mutation para eliminar productos
    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO,{
        update(cache){
            //obtener una copia del objeto de cache
            const {obtenerProductos} = cache.readQuery({query: OBTENER_PRODUCTOS});
            //Reescribir el cache
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data:{
                    obtenerProductos: obtenerProductos.filter(productoActual => productoActual.id !== id)
                }
            })
        }
    }); 

    const editarProducto = () =>{
        Router.push({
            pathname:"/editarproducto/[id]",
            query: {id}
        })
    }
    const confirmarEliminarProducto = () =>{
        Swal.fire({
            title: '¿Deseas elimiar a este producto?',
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
                   //eliminar el producto
                   const {data} = await eliminarProducto({
                        variables:{
                            id
                        }
                   });
                   console.log(data);
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

    return(
        <tr>
            <td className="border px-4 py-2">{nombre}</td>
            <td className="border px-4 py-2">{existencia} piezas</td>
            <td className="border px-4 py-2">${precio}</td>
            <td className="border px-4 py-2">
                <button type="button" className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold" onClick={() =>confirmarEliminarProducto()}>
                    Eliminar
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 ml-2"stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </td>
            <td className="border px-4 py-2">
                <button type="button" className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold" onClick={() =>editarProducto()}>
                    Editar
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"  className="w-6 h-6 ml-2" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
            </td>
        </tr>
    );
}

export default Producto