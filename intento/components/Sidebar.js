import React from 'react'
import Link from 'next/link'
import Header from '../components/Header';
import {useRouter} from 'next/router'
const Sidebar = () =>{
    //routing de next

    const router = useRouter();

    return(
        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
            
            <div>
                <p className="text-white text-2xl font-black">Bienvenido a U3Citas</p>
            </div>

            <nav className="mt-5 list-none">
                <li className={router.pathname === "/" ? "bg-blue-800 p-2": "p-2"}>
                    <Link href="/">
                        <a className="text-white  block">
                            Citas
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/nuevacita" ? "bg-blue-800 p-2 mb-2": "mb-2 p-2"}>
                    <Link href="/nuevacita">
                        <a className="text-white  block">
                        Agendar nueva Cita
                        </a>
                    </Link>
                </li>
                
            </nav>
            <Header/>  
            
        </aside>
    );
}

export default Sidebar;