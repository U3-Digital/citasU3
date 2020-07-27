import React from 'react'
import LayoutAdmin from '../../components/admin/LayoutAdmin';
import TablaUsuarios from '../../components/admin/usuarios/TablaUsuarios'
import Link from 'next/link'
const Usuarios = () =>{
    return(
        <LayoutAdmin>
             <h1 className="text-2xl text-gray-800 font-light">Usuarios</h1>
             <Link href="nuevousuario">
                <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded  text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nuevo Usuario</a>
            </Link>
            <div className="overflow-x-scroll">
                <TablaUsuarios/>
            </div>
        </LayoutAdmin>
    )
}

export default Usuarios;