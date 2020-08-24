import React from 'react'
import Head from 'next/head'
import Sidebar from '../components/Sidebar';
import {useRouter, Router} from 'next/router'

const Layout = ({children}) =>{
    const router = useRouter();
    return (
        <>
            <Head>
                <title>U3Citas</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU=" crossOrigin="anonymous" />
            <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></link>
            </Head>
            {router.pathname === '/login' || router.pathname === '/nuevacuenta/[pid]' || router.pathname === '/4dm1n/login' ?(
                <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
                    <div>
                        {children}
                    </div>
                </div>
            ): (
                <div className="bg-gray-800 min-h-screen justify-center">
                    <div className="flex justify-center text-white">
                        <p className="text-white text-2xl mt-2 font-black">Bienvenido a U3Citas</p>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            )}  
        </>
    );
}

export default Layout;