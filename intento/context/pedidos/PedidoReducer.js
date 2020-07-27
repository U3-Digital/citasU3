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

export default ( state,action) => {
    switch(action.type){
        case SELECCIONAR_CLIENTE:
            return{
                ...state,
                cliente: action.payload
            }
        case SELECCIONAR_PRODUCTO:
            return{
                ...state,
                productos: action.payload
            }
        case CANTIDAD_PRODUCTOS:
            return{
                ...state,
                productos: state.productos.map(producto => producto.id ===action.payload.id ? producto= action.payload : producto)
            }
        case ACTUALIZAR_TOTAL:
            return{
                ...state,
                total: state.productos.reduce( (nuevoTotal, articulo) =>nuevoTotal += articulo.precio,0 )
            }
        case SELECCIONAR_USUARIO:
            return{
                ...state,
                usuario: action.payload
            }
        case SELECCIONA_FECHA:
            return{
                ...state,
                fecha:action.payload
            }
        case SELECCIONA_HORA:
            return{
                ...state,
                hora: action.payload
            }
        case SELECCION_PRODUCTO_COMPLETAR:
            return{
                ...state,
                productos: action.payload
            }
        case SELECCIONAR_CUPON:
            return{
                ...state,
                cupon: action.payload
            }
        case ACTUALIZAR_TOTAL_COMPLETAR:
            return{
                ...state
            }
        default:
            return state
    }
}