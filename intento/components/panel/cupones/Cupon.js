import React from 'react'
import {gql, useQuery, useMutation} from '@apollo/client';
import Swal from 'sweetalert2';
import Router from 'next/router';

const ELIMINAR_CUPON = gql`
    mutation eliminarCupon($id: ID!){
        eliminarCupon(id: $id)
    }
`;

const OBTENER_CUPONES = gql`
    query obtenerCuponesEmpresa{
        obtenerCuponesEmpresa{
            nombre
            descuento
            vigencia
            id
        }
    }
`;

const Cupon =({cupon}) =>{

    const {id,nombre, vigencia, descuento} = cupon;
    
    const [eliminarCupon] = useMutation(ELIMINAR_CUPON,{
        update(cache){
            //obtener una copia del objeto de cache
            const {obtenerCuponesEmpresa} = cache.readQuery({query: OBTENER_CUPONES});
            //Reescribir el cache
            cache.writeQuery({
                query: OBTENER_CUPONES,
                data:{
                    obtenerCuponesEmpresa: obtenerCuponesEmpresa.filter(cuponActual => cuponActual.id !== id)
                }
            })
        }
    });

    const confirmarEliminarCupon = (id) =>{
        Swal.fire({
            title: '¿Deseas eliminar a este Cupon?',
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
                    const {data} = await eliminarCupon({
                        variables:{
                            id
                        }
                    });
                    
                    //mostrar una alerta
                    Swal.fire(
                        'Eliminado',
                        data.eliminarCupon,
                        'success'
                      ) 
                } catch (error) {
                    console.log(error);
                }
              
            }
        })
    }

    const editarCupon = () =>{
        Router.push({
            pathname : "/controlpanel/editarcupon/[id]",
            query : {id}
        })
    }
    const fecha = new Date(parseInt(vigencia));
    let formatted_date = fecha.getDate() + "/" + (fecha.getMonth()+1) + "/" + fecha.getFullYear();
    
    return(
        <div className=" border-blue-500 m-2 border-t-4  bg-white rounded p-6  shadow-lgv xl:w-full sm:w-full">
            <div className="w-2/2">
                <p className=" flex font-bold text-gray-800 ">
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 mr-2" stroke="currentColor"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                    Nombre: {nombre}
                </p>
                <p className="flex items-center my-2 ">
                   descuento: {descuento}%
                </p>
                <p className="flex items-center my-2" >
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>  
                    {formatted_date}
                </p>
                <div className="flex">
                    <button type="button" className="flex justify-center items-center bg-green-600 py-2 px-4 w-3/4 text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>editarCupon()}>
                        Editar
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"  className="w-6 h-6 ml-2" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button type="button" className="flex justify-center ml-2 items-center bg-red-800 py-2 px-4 w-1/4 text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>confirmarEliminarCupon(id)}>
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 ml-2"stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
                
            </div>
        </div>
    )
}

export default Cupon;