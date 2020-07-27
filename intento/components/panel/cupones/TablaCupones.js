import React from 'react'
import {gql,useQuery} from '@apollo/client';
import Cupon from './Cupon';
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

const TablaCupones = () =>{

    const {data,loading,error} = useQuery(OBTENER_CUPONES);

    if(loading) return('Cargando..');


    return(
        <div className="md:grid md:grid-cols-3 md:gap-4">
            {data.obtenerCuponesEmpresa.map(cupon =>(
                <Cupon
                key={cupon.id}
                cupon={cupon}
                />
            ))}
        </div>
    )
}
export default TablaCupones;