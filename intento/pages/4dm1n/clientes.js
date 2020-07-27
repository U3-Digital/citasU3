import React from 'react'
import LayoutAdmin from '../../components/admin/LayoutAdmin';
import Link from 'next/link'
import TablaClientes from '../../components/admin/clientes/TablaClientes';
const Cliente =() =>{
    return(
        <LayoutAdmin>
            <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
            <Link href="nuevocliente">
                <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded  text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nuevo Cliente</a>
            </Link>
            <div className="overflow-x-scroll">
                <TablaClientes/>
            </div>
        </LayoutAdmin>
    );
}
export default Cliente;