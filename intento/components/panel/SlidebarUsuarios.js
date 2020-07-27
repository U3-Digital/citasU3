import React,{useState} from 'react'
import Link from 'next/link'
import HeaderUsuario from '../../components/panel/HeaderUsuarios';
import {useRouter} from 'next/router'
import { useQuery, gql } from '@apollo/client'
const OBTENER_USUARIO = gql`
    query obtenerUsuario{
        obtenerUsuario{
            id
            nombre
            apellido
            telefono
            rol
        }
    }
`;

const SidebarUsuarios = () =>{

    const[menu,setmenu] = useState(false);
    const [assideform,setassideform] = useState(` bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5`)
    const [color,setColor] = useState(`text-white`)
    const router = useRouter();
    //query de apollo 
    const {data,loading, error} = useQuery(OBTENER_USUARIO);
    //proteger que no accedamos a data antes de tener resultados
    if(loading) return null;
    //si no hay información
    //console.log(data);
    if(!data.obtenerUsuario){
        router.push('/controlpanel/login');
    }

    const {obtenerUsuario} = data;
    /*if(rol !== 'SUPERADMINISTRADOR'){ 
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No cuentas con las creedenciales para acceder a esta pagina'
          })
          setTimeout(() => {
            return( 
                router.push('/4dm1n/login')
                );
          }, 200);
        
    }*/
    const mostrarmenu = () =>{
        if(menu === false){
            setmenu(true);
            setassideform(`outline-none xl:w-16 sm:h-16  px-5`)
            setColor(null)
        }else{
            setmenu(false);
            setassideform(` outline-none bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5`)
            setColor("text-white")
        }
    }
    return(
        <aside className={`${assideform}`}>
            <div className="relative h-auto w-full outline-none">
                <button type="button" className={`  absolute top-0 right-0 h-8 w-8 flex justify-center  items-center ${color} rounded text-xs md:ml-3 uppercase font-bold mt-3`} onClick={() =>mostrarmenu()}>
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 outline-none h-6 ml-2"stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>
            <div hidden={menu}>
            <div>
                <p className="text-white text-2xl font-black">Citas</p>
            </div>

            <nav className="mt-5 list-none">
                <li className={router.pathname === "/controlpanel/" ? "bg-blue-800 p-2": "p-2"}>
                    <Link href="/controlpanel/citas">
                        <a className="text-white  block">
                            Mis citas
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/controlpanel/nuevacita" ? "bg-blue-800 p-2": "p-2"}>
                    <Link href="/controlpanel/nuevacita">
                        <a className="text-white  block">
                        Agendar nueva cita
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/controlpanel/solicitudesdecita" ? "bg-blue-800 p-2": "p-2"}>
                    <Link href="/controlpanel/solicitudesdecita">
                        <a className="text-white  block">
                            Solicitudes de Citas
                        </a>
                    </Link>
                </li>
            </nav>
            {obtenerUsuario.rol ==="ADMINISTRADOR" ? (
                <>
                    <div className="sm:mt-10">
                        <p className="text-white text-2xl font-black">Operaciones</p>
                    </div>
                    <nav className="mt-5 list-none">
                        <ul>
                            <li className={router.pathname === "/controlpanel/clientes" ? "bg-blue-800 p-2": "p-2"}>
                                <Link href="/controlpanel/clientes">
                                    <a className="text-white  block">
                                        Clientes
                                    </a>
                                </Link>
                            </li>
                            <li className={router.pathname === "/controlpanel/solicitudesClientes" ? "bg-blue-800 p-2": "p-2"}>
                                <Link href="/controlpanel/solicitudesClientes">
                                    <a className="text-white  block">
                                        Solicitudes de Clientes
                                    </a>
                                </Link>
                            </li>
                            <li className={router.pathname === "/controlpanel/productos" ? "bg-blue-800 p-2": "p-2"}>
                                <Link href="/controlpanel/productos">
                                    <a className="text-white  block">
                                        Productos
                                    </a>
                                </Link>
                            </li>
                            <li className={router.pathname === "/controlpanel/cupones" ? "bg-blue-800 p-2": "p-2"}>
                                <Link href="/controlpanel/cupones">
                                    <a className="text-white  block">
                                        Cupones
                                    </a>
                                </Link>
                            </li>
                            <li className={router.pathname === "/controlpanel/usuarios" ? "bg-blue-800 p-2": "p-2"}>
                            <Link href="/controlpanel/usuarios">
                                <a className="text-white  block">
                                    Usuarios
                                </a>
                            </Link>
                            </li>
                        </ul>
                    </nav>
                    <HeaderUsuario
                        key ={obtenerUsuario.id}
                        usuario ={obtenerUsuario}
                    />  
                </> 
            ):(
               null 
            ) 
            }
            </div> 
        </aside>

    );
    
}

export default SidebarUsuarios;