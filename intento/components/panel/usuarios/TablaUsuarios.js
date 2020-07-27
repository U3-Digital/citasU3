import React from 'react'
import { gql,useQuery} from '@apollo/client';
import Usuario from './Usuario';
const OBTENER_USUARIOS = gql`
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

const TablaUsuarios = () =>{

    const {data,loading,error} = useQuery(OBTENER_USUARIOS);

    if(loading) return('Cargando...');

    
    return(
        <div className="md:grid md:grid-cols-3 md:gap-4">
            {data.obtenerUsuarios.map(usuario =>(
                <Usuario
                key={usuario.id}
                usuario={usuario}
                />
            ))}
        </div>
    )
}

export default TablaUsuarios;