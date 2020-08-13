import React, { useEffect } from 'react'
import MejoresClientes from './MejoresClientes';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
  } from 'recharts';
import {useQuery, gql,useMutation} from '@apollo/client';

const OBTENER_ESTADISTICAS = gql`
    query obtenerEstadisticas($tiempo: Tiempo!){
        obtenerEstadisticas(tiempo: $tiempo){
            _id
            total
        }
    }
`;

const OBTENER_INGRESOS = gql`
    query obteneringresos($tiempo: Tiempo!){
        obteneringresos(tiempo: $tiempo){
            total
            cantidad
        }
    }
`;

const TablaResumenes = ({filtro}) =>{
    const {data,loading,error,startPolling,stopPolling} = useQuery(OBTENER_INGRESOS,{
        variables:{
            tiempo: filtro
        }
    })
    const {data: dataE,loading:loadingE,error:errorE,startPolling:startPolling2,stopPolling:stopPolling2} = useQuery(OBTENER_ESTADISTICAS,{
        variables:{
            tiempo: filtro
        }
    });


    useEffect(() =>{
        startPolling(1000);
        return () =>{
            stopPolling();
        }
    },[startPolling, stopPolling]);
    useEffect(() =>{
        startPolling2(1000);
        return () =>{
            stopPolling2();
        }
    },[startPolling2, stopPolling2]);
    
    if(loading || loadingE) return null;
    const {obtenerEstadisticas} = dataE;

    let dataGrafica= [];

    obtenerEstadisticas.map(estadistica =>{
        let fecha = new Date(parseInt( estadistica._id));
        dataGrafica.push({name:(`${fecha.getDate()}-${fecha.getMonth()+1}-${fecha.getFullYear()}`),total: estadistica.total});

    });
    //console.log(dataGrafica);
    const {obteneringresos} = data;
    return(
        <>
            <div>
                <div className="mt-5 flex ">
                    <div className="bg-green-100 border-b-4 border-green-600 rounded-lg mr-2  xl:w-1/3 sm:w-full shadow-lg p-5">
                        <div className=" flex flex-row items-center">
                            <div className="flex-shrink pr-4">
                                
                                <div className="rounded-full p-5 bg-green-600"><svg viewBox="0 0 20 20" fill="currentColor" className="currency-dollar w-6 h-6"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path></svg></div>
                            </div>
                            <div className="flex-1 text-right md:text-center">
                                <h5 className="font-bold uppercase text-gray-600">Total de ingresos</h5>
                                <h3 className="font-bold text-3xl">${obteneringresos.total} <span className="text-green-500"><i className="fas fa-caret-up"></i></span></h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-100 border-b-4 mr-2 border-orange-600 rounded-lg  xl:w-1/3 sm:w-full shadow-lg p-5">
                        <div className=" flex flex-row items-center">
                            <div className="flex-shrink pr-4">
                                
                                <div className="rounded-full p-5 bg-orange-600">
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="calendar w-6 h-6"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                                </div>
                            </div>
                            <div className="flex-1 text-right md:text-center">
                                <h5 className="font-bold uppercase text-gray-600">Citas Agendadas</h5>
                                <h3 className="font-bold text-3xl">{obteneringresos.cantidad} <span className="text-green-500"><i className="fas fa-caret-up"></i></span></h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-100 border-b-4 border-purple-600 rounded-lg  xl:w-1/3 sm:w-full shadow-lg p-5">
                        <div className=" flex flex-row items-center">
                            <div className="flex-shrink pr-4">
                                
                                <div className="rounded-full p-5 bg-purple-600">
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="badge-check w-6 h-6"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>   
                                </div>
                            </div>
                            <div className="flex-1 text-right md:text-center">
                                <h5 className="font-bold uppercase text-gray-600">Citas Completadas</h5>
                                <h3 className="font-bold text-3xl">59 <span className="text-green-500"><i className="fas fa-caret-up"></i></span></h3>
                            </div>
                        </div>
                    </div>

                
                </div>
                <div className="flex">
                    <div className="w-1/3"></div>
                    <div className="w-2/3 h-64 mt-5">
                        <ResponsiveContainer>
                            <LineChart
                                data={dataGrafica}
                                margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
            </div>
        </>
    );
}

export default TablaResumenes;