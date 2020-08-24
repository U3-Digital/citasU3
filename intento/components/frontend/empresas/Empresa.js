import React from 'react'
import Router, { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import {useQuery,gql,useMutation} from '@apollo/client';


const Empresa = (empresa) =>{
    console.log(empresa);
    const {nombre,direccion,email} = empresa.empresa;

    return(
        <div className={`border-blue-200 m-2 border-t-4  bg-white rounded p-6  shadow-lgv xl:w-full sm:w-full`}>
            <p className=" font-bold text-gray-800 "> Empresa: {nombre}</p>
            <p className="flex items-center my-2 ">
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                {email}
            </p>
            <p className="flex items-center my-2 ">
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                {direccion}
            </p>
            <button type="button" className="flex justify-center ml-2 items-center bg-blue-400 py-2 px-4 text-white rounded text-xs uppercase font-bold mt-3" onClick={() =>editarCita(id)}>
                Reagendar
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"  className="w-6 h-6 ml-2" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
        </div>
    );
}

export default Empresa;