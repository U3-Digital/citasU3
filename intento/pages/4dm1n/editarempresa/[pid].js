import React from 'react'
import LayoutAdmin from '../../../components/admin/LayoutAdmin';
import EditaEmpresa from '../../../components/admin/empresas/EditaEmpresa';
import {useRouter} from 'next/router'
const EditarEmpresa = () =>{
    const router = useRouter();
    const {query: {id}} = router;

    
    return(
        <LayoutAdmin>
            <h1 className="text-2xl text-gray-800 font-light">Editar Empresa</h1>
            <EditaEmpresa
            id={id}
            />
        </LayoutAdmin>
    );
}

export default EditarEmpresa;