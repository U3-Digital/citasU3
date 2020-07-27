import React from 'react'
import Head from 'next/head'
import {useRouter, Router} from 'next/router'
import SidebarUsuarios from './SlidebarUsuarios';

const LayoutUsuarios = ({children}) =>{
    const router = useRouter();
    return (
        <>
            <Head>
                <title>Control Panel || supercitas</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU=" crossOrigin="anonymous" />
            <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></link>
            </Head>
            {router.pathname === '/login' || router.pathname === '/nuevacuenta' || router.pathname === '/controlpanel/login' ?(
                <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
                    <div>
                        {children}
                    </div>
                </div>
            ): (
                <div className="bg-gray-200 min-h-screen">
                    <div className="sm:flex min-h-screen">
                        <SidebarUsuarios/>
                        <main className="w-full sm:min-h-screen p-5 mr-1">
                            
                            {children}
                        </main>
                    </div>
                </div>
            )}  
        </>
    );
}

export default LayoutUsuarios;