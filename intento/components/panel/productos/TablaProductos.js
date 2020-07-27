import React from 'react'
import { gql,useQuery,useMutation} from '@apollo/client';
import Producto from './Producto'

const OBTENER_PRODUCTOS = gql`
    query obtenerProductosEmpresa{
        obtenerProductosEmpresa{
            id
            nombre
            precio
        }
    }          
`;

const TablaProductos = () =>{
    const {data,loading, error} = useQuery(OBTENER_PRODUCTOS);

    if(loading) return('Cargando...');

    if(data.obtenerProductosEmpresa.length === 0){
        return(
            <div className="flex justify-center py-2 ">
                <p className="mt-5 my-2 text-gray-700 p-2 text-sm font-bold ">No cuentas con productos registrados</p>
            </div>
        );
    }

    return(
        <div className="md:grid md:grid-cols-3 md:gap-4">
            {data.obtenerProductosEmpresa.map(producto =>(
                <Producto
                key={producto.id}
                producto={producto}
                />
            ))}
        </div>
        
    )
    
}
export default TablaProductos;