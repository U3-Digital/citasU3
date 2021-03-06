import React from 'react'
import Head from 'next/head'
import SidebarAdmin from './SidebarAdmin'
import {useRouter, Router} from 'next/router'

const Layout = ({children}) =>{
    const router = useRouter();
    return (
        <>
            <Head>
                <title>Administración</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU=" crossOrigin="anonymous" />
            <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></link>
            </Head>
            {router.pathname === '/login' || router.pathname === '/nuevacuenta' || router.pathname === '/4dm1n/login' ?(
                <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
                    <div>
                        {children}
                    </div>
                </div>
            ): (
                <div className="bg-gray-200 min-h-screen">
                    <div className="sm:flex min-h-screen">
                        <SidebarAdmin/>
                        <main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5">
                            
                            {children}
                        </main>
                    </div>
                </div>
            )}  
        </>
    );
}

export default Layout;