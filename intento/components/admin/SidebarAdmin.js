import React from 'react'
import Link from 'next/link'
import HeaderAdmin from './HeaderAdmin';
import {useRouter} from 'next/router'
const SidebarAdmin = () =>{
    //routing de next

    const router = useRouter();

    return(
        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
            <HeaderAdmin/>
            <div>
                <p className="text-white text-2xl font-black">Empresas </p>
            </div>

            <nav className="mt-5 list-none">
                <li className={router.pathname === "/4dm1n/empresas" ? "bg-blue-800 p-2": "p-2"}>
                    <Link href="/4dm1n/empresas">
                        <a className="text-white  block">
                            Ver Empresas
                        </a>
                    </Link>
                </li>
                
            </nav>
            <div className="sm:mt-10">
                <p className="text-white text-2xl font-black">Usuarios y Clientes</p>
            </div>
            <nav className="mt-5 list-none">
                <li className={router.pathname === "/4dm1n/usuarios" ? "bg-blue-800 p-2": "p-2"}>
                    <Link href="/4dm1n/usuarios">
                        <a className="text-white  block">
                            Ver Usuarios
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/4dm1n/clientes" ? "bg-blue-800 p-2": "p-2"}>
                    <Link href="/4dm1n/clientes">
                        <a className="text-white  block">
                            Ver Clientes
                        </a>
                    </Link>
                </li>
        
            </nav>
            <div className="sm:mt-10">
                <p className="text-white text-2xl font-black">Operaciones</p>
            </div>
            <nav className="mt-5 list-none">
                <li className={router.pathname === "/4dm1n/productos" ? "bg-blue-800 p-2": "p-2"}>
                    <Link href="/4dm1n/productos">
                        <a className="text-white  block">
                            Productos
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/4dm1n/citas" ? "bg-blue-800 p-2": "p-2"}>
                    <Link href="/4dm1n/citas">
                        <a className="text-white  block">
                            Citas
                        </a>
                    </Link>
                </li>
            </nav>
        </aside>
    );
}

export default SidebarAdmin;