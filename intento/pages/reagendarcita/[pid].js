import React from 'react'
import {useRouter} from 'next/router';
import Layout from '../../components/Layout';
import EditarCita from '../../components/frontend/citas/EditarCita';
const ReagendarCita = () =>{   

     //obtener el id actual
     const router = useRouter();
     const { query: {id}} = router;

    return(
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Reagendar cita </h1>     
            <EditarCita
                key = {id}
                id = {id}
            />
        </Layout>
    )
}

export default ReagendarCita