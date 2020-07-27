
import Layout from '../components/Layout'

import Link from 'next/link'
import TablaProductos from '../components/productos/Tablaproductos'



 const Productos = ()  =>{

  
  
    return (
      <div>
        <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
        <Link href="nuevoproducto">
        <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded  text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nuevo Producto</a>
        </Link>
        <div className="overflow-x-scroll">
          <TablaProductos/>
        </div>
        </Layout>
      </div>
    )
  }

  export default Productos