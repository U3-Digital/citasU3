import React from 'react'
import LayoutAdmin from '../../components/admin/LayoutAdmin';
import Link from 'next/link'
import TablaEmpresas from '../../components/admin/empresas/TablaEmpresas';
const Empresas = () =>{
    return(
        <LayoutAdmin>
            <h1 className="text-2xl text-gray-800 font-light">Empresas</h1>
            <Link href="nuevaempresa">
                <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded  text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nueva Empresa</a>
            </Link>
            <div className="overflow-x-scroll">
                <TablaEmpresas/>
            </div>
        </LayoutAdmin>
    )
}
export default Empresas;