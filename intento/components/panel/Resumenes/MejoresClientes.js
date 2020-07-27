import React,{useEffect} from 'react'
import {gql,useQuery} from '@apollo/client';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';

const OBTENER_MEJORES_CLIENTES = gql`
    query mejoresClientes{
        mejoresClientes{
            cliente{
                nombre
                apellido
            }
            total
        }
    }
`;


const MejoresClientes = () =>{
    const {data,loading, error ,startPolling, stopPolling} = useQuery(OBTENER_MEJORES_CLIENTES);

    useEffect(() =>{
        startPolling(1000);
        return () =>{
            stopPolling();
        }
    },[startPolling, stopPolling])

    if (loading) return null;
    console.log(data);
    const {mejoresClientes} = data;
    const clienteGrafica=[];


    mejoresClientes.map((cliente,index) => {
        clienteGrafica[index] ={
            ...cliente.cliente[0],
            total: cliente.total
        }
    })

    return(
        <BarChart
                className="mt-10"
                width={300}
                height={166}
                data={clienteGrafica}
                margin={{
                top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3182CE" />
            </BarChart>
    );
}

export default MejoresClientes;