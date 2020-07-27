import React,{useReducer} from 'react';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';
import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTOS,
    ACTUALIZAR_TOTAL,
    SELECCIONAR_USUARIO,
    SELECCIONA_FECHA,
    SELECCIONA_HORA,
    SELECCION_PRODUCTO_COMPLETAR,
    SELECCIONAR_CUPON,
    ACTUALIZAR_TOTAL_COMPLETAR
}from '../../types';

const PedidoState = ({children}) =>{

    //State de pedidos
    const initialState ={
        cliente: {},
        usuario: {},
        fecha: "",
        hora: "",
        productos: [],
        total: 0,
        cupon: {}
    }

    const [state, dispatch] = useReducer(PedidoReducer,initialState);

    //Modifica el cliente
    const agregarCliente = cliente =>{
        //console.log(cliente);

        dispatch({
            type:SELECCIONAR_CLIENTE,
            payload: cliente
        })
    }

    //modificar usuario
    const agregarUsuario = usuario =>{
        dispatch({
            type:SELECCIONAR_USUARIO,
            payload:usuario
        })
    }

    //modificar fecha

    const agregarFecha = fecha =>{
        
        dispatch({
            type:SELECCIONA_FECHA,
            payload: fecha
        })
    }

    //modificar la hora

    const agregarHora = hora =>{
        dispatch({
            type: SELECCIONA_HORA,
            payload: hora
        })
    }

    //Modifica los productos 
    const agregarProducto = productosSeleccionados =>{

        let nuevoState;
        if(state.productos.length >0 && productosSeleccionados !==null){
            //Tomar del segundo arreglo una copia para asignarlo al primero
            nuevoState = productosSeleccionados.map(producto =>{
                const nuevoObjeto = state.productos.find(productoState => productoState.id === producto.id);
                return {...producto, ...nuevoObjeto}
            });
        }else{
            if(productosSeleccionados === null){
                nuevoState = []
            } else{
                nuevoState = productosSeleccionados;
            }
        }

        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: nuevoState 
        })
    }

    //Modifica las cantidades de los productos
    const cantidadProductos = nuevoProducto =>{
        dispatch({
            type: CANTIDAD_PRODUCTOS,
            payload: nuevoProducto
        })
    }

    const actualizarTotal = () =>{
        dispatch({
            type : ACTUALIZAR_TOTAL
        })
    }

    //Modifica el Cupon
    const agregarCupon = cupon =>{
        //console.log(cliente);

        dispatch({
            type:SELECCIONAR_CUPON,
            payload: cupon
        })
    }

    const actualizarTotalCompletar = () =>{
        dispatch({
            type : ACTUALIZAR_TOTAL_COMPLETAR
        })
    }

    return(
        <PedidoContext.Provider
        value = {{
            cliente: state.cliente,
            usuario: state.usuario,
            fecha: state.fecha,
            hora: state.hora,
            cupon: state.cupon,
            productos: state.productos,
            total: state.total,
            agregarProducto,
            agregarCliente,
            agregarUsuario,
            agregarFecha,
            agregarHora,
            cantidadProductos,
            actualizarTotal,
            agregarCupon,
            actualizarTotalCompletar
        }}
        >
            {children}
        </PedidoContext.Provider>
    )
}

export default PedidoState;