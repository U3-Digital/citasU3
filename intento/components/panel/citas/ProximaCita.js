import React, {useState} from 'react'
import PedidoCita from './PedidoCita';
const ProximaCita = ({cita}) =>{
    const {id,pedido,total,cliente:{nombre,id: idcliente,apellido,email,telefono},empresa,fecha,estado} = cita;
    const [valido, setvalido] = useState(true);
    const [border, setborder] = useState("")
    const fechacita = new Date(parseInt(fecha));
    let formatted_date =fechacita.getDate() + "/" +(fechacita.getMonth()+1) + "/" +fechacita.getFullYear();
    const mostrarcita = () =>{
        if(valido === true){
            setvalido(false);
            setborder(" border-b-2 border-gray-600 ")
        }else{
            setvalido(true);
            setborder("");
        }
    }

    return(
        <div className="rounded-md mt-2 mb-2 px-1 bg-white py-2 ">
            <div className={`flex justify-between py-2 ${border}`}>
                <div className="ml-2 flex justify-end">
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2 mt-1" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>  
                    {formatted_date}
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2 mt-1 ml-2" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>  
                    {fechacita.getHours()}:00
                </div>
                <button type="button" className="flex " onClick={() =>mostrarcita(id)}>
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 ml-2"stroke="currentColor"><path d="M19 9l-7 7-7-7"></path></svg>
                </button>
            </div>
            <div className="px-2" hidden={valido}>
                <p className=" font-bold text-gray-800 "> Cita para: {nombre} {apellido}</p>
                {
                    pedido.map(producto =>(
                        <PedidoCita
                        key = {producto.id}
                        producto = {producto}
                        />
                    ))
                }
                <p className=" font-bold text-gray-800 flex justify-end mr-5 "> Total: ${total}</p>
        
            </div>
            </div>
    )
}

export default ProximaCita;