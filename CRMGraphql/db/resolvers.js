const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Empresa = require('../models/Empresa');
const { Error } = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const crearToken = (usuario, secreta, expiresIn) =>{
    //console.log(usuario);
    const {id,email,nombre,apellido,rol,status,telefono} = usuario;
    return jwt.sign( {id, email, nombre, apellido,rol,status,telefono},secreta,{expiresIn})
}

//resolvers
const resolvers = {
    Query: {
        obtenerUsuario: async (_,{},ctx) =>{
            return ctx.usuario;
        },
        obtenerUnUsuario: async(_,{id},ctx) =>{
            if(ctx.usuario.rol !== 'SUPERADMINISTRADOR'){
                throw new Error('No cuentas con las credenciales');
            }
            const existeUsuario = Usuario.findById(id).populate('empresa');
            if(!existeUsuario){
                throw new Error('El Usuario No Existe');
            }
            return existeUsuario;
        } ,
        obtenerUsuarios: async (_,{},ctx) =>{
            const {rol} = ctx.usuario;
            
            if(rol !== 'SUPERADMINISTRADOR'){
                throw new Error('no cuenta con las credenciales para esta accion');
            }
            const usuarios = await Usuario.find({});
                
            return usuarios;
            
            
            
        },
        obtenerProductos: async(_,{id}) =>{
            try {
                const productos = await Producto.find({empresa: id.toString()});
                return productos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProducto: async(_,{id})=>{
            //revisar si el producto existe
            const producto = await Producto.findById(id);
            if(!producto){
                throw new Error('Producto no encontrado'); 
            }
            return producto;
        },
        obtenerClientes: async () =>{
                try {
                    const clientes = await Cliente.find({}).populate('empresa');
                    return clientes;
                } catch (error) {
                    console.log(error);
                }
        },
        obtenerClientesVendedor: async (_,{},ctx)=>{
            try {
                const clientes = await Cliente.find({vendedor: ctx.usuario.id.toString()});
                return clientes;
            } catch (error) {
                console.log(error);
            }

        },
        obtenerCliente: async (_,{id},ctx) =>{
            //revisar si el cliente existe o no
            const cliente = await Cliente.findById(id)
            if(!cliente){
                throw new Error('Clidente no encontrado');
            }
            //Quien lo creó puede verlo
            if(cliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales');
            }

            return cliente;
        },
        obtenerPedidos: async () =>{
            try {
                const pedidos = await Pedido.find({});
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedidosVendedor: async (_,{},ctx) =>{
            try {
                const pedidos = await Pedido.find({empleado : ctx.usuario.id}).populate('cliente');
                //console.log(ctx.usuario.id);
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedido: async (_,{id},ctx) =>{
            //verificar si el pedido existe
            const pedido = await Pedido.findById(id);
            if(!pedido){
                throw new Error ('El pedido no existe');
            }
            //Solo quien lo creo puede verlo
            if(pedido.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales para acceder a este pedido')
            }
            //retornar el resultado
            return pedido;
        },
        obtenerPedidosEstado: async (_,{estado},ctx) =>{
            const pedidos = await Pedido.find({vendedor : ctx.usuario.id, estado});

            return pedidos;
        },
        mejoresClientes: async () => {
            const clientes  = await Pedido.aggregate([
                {$match : {estado : "COMPLETADO"}},
                {$group : {
                    _id : "$cliente",
                    total:{$sum: '$total'}
                }},
                {
                    $lookup: {
                        from: 'clientes',
                        localField: '_id',
                        foreignField: "_id",
                        as: "cliente"
                    }
                },
                {
                    $limit: 15
                },
                {
                    $sort : {total : -1}
                }
            ]);
            return clientes;
        },
        mejoresVendedores: async () =>{
            const vendedores =  await Pedido.aggregate([
                {$match : {estado: "COMPLETADO"}},
                {$group : {
                    _id : "$vendedor",
                    total: {$sum : '$total'}
                }},
                {
                    $lookup: {
                        from: 'usuarios',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'vendedor'
                    } 
                },
                {
                    $limit: 3
                },
                {
                    $sort: {total: -1}
                }
            ]);

            return vendedores;
        },
        buscarProducto: async(_,{texto}) =>{
            const productos = await Producto.find({ $text: {$search : texto }}).limit(10);

            return productos;
        },
        obtenerEmpresas: async () =>{
            try {
                const empresas = await Empresa.find({});
                //console.log(empresas);
                return empresas;
            } catch (error) {
                console.log(error);
            }
            
        },
        obtenerEmpresa: async (_,{id},ctx) =>{  

            
            const empresa = await Empresa.findById(id);

            if(!empresa){
                throw new Error('La empresa no existe');
            }

            return empresa;
        }
    },
    Mutation: {
        nuevoUsuario: async (_,{input}) =>{
            const{email,password,rol,empresa} = input;
            //revisar usuario ya esta registrado
            const existeUsuario = await Usuario.findOne({email});
            if(existeUsuario){
                throw new Error('El usuario ya esta registrado');
            }
            if(rol === "SUPERADMINISTRADOR" && empresa !== ""){
                throw new Error('Un superadministrador no puede tener una empresa');
            }

            if(input.empresa === ""){
                input.empresa = null;
            }

            //hashear su password
            const salt= await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);
            
            try {
                //guardarlo en la BD
                const usuario = new Usuario(input);
                usuario.save(); //guardarlo
                return usuario; 

            } catch (error) {
                console.log(error);
            }
        },
        eliminarUsuario: async (_,{id},ctx) =>{
            
            const {rol} = ctx.usuario;

            if(rol !== 'SUPERADMINISTRADOR'){
                throw new Error('no cuentas con las credenciales para registrar una empresa');
            }
            
            await Usuario.findByIdAndDelete({_id: id});
            return "Usuario Eliminado";
        },
        autenticarUsuario: async (_,{input}) =>{
            const {email,password} = input;
            //si el usuario existe 
            const existeUsuario = await Usuario.findOne({email});
            if(!existeUsuario){
                throw new Error('El usuario no existe');
            }
            //revisar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if(!passwordCorrecto){
                throw new Error('El password es incorrecto');
            } 

            //crear el Token
            return {
                token: crearToken(existeUsuario,process.env.SECRETA, '24H')
            }

        },
        nuevoProducto: async (_,{input}) =>{
            try {
                const producto = new Producto(input);
                const resultado = await producto.save();
                return resultado;
            } catch (error) {
                console.log(error)
            }
        },
        actualizarProducto: async (_,{id,input}) =>{
          //revisar si el producto existe
          let producto = await Producto.findById(id);
          if(!producto){
              throw new Error('Producto no encontrado'); 
          } 
          //guardarlo en la bd
          producto = await Producto.findOneAndUpdate({_id : id}, input,{new: true});
          return producto;
        },
        eliminarProducto: async (_,{id}) =>{
            //revisar si el producto existe
          let producto = await Producto.findById(id);
          if(!producto){
              throw new Error('Producto no encontrado'); 
          } 

          //Eliminar Producto
          await Producto.findByIdAndDelete({_id: id});
          return "Producto Eliminado";
        },
        nuevoCliente: async (_,{input},ctx) =>{
            const {email,password, empresa} = input;
            //console.log(ctx);
            //verificar si el cliente ya esta registrado
            //console.log(input);
            const cliente = await Cliente.findOne({email, empresa});
            if(cliente){
                throw new Error('Ese Cliente ya esta registrado');
            } 
            //hashear
            const salt= await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);
            const nuevoCliente = new Cliente(input);
            //asignar el vendedor
            //nuevoCliente.vendedor = ctx.usuario.id;

            //guardar en la BD
            try {
                
                const resultado = await nuevoCliente.save();

                return resultado;  
            } catch (error) {
                console.log(error)
            }
            
        },
        actualizarCliente: async(_,{id,input},ctx) => {
            //verifica sis existe o no
            let cliente = await Cliente.findById(id);
            if(!cliente){
                throw new Error ('Ese cliente no existe')
            }
            //verificar si el vendedor es quien edita
            if(cliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales');
            }
            //guardar el cliente
            cliente = await Cliente.findOneAndUpdate({_id : id},input,{new : true});
            return cliente;
        },
        eliminarCliente: async (_,{id},ctx) =>{
            //verifica sis existe o no
            let cliente = await Cliente.findById(id);
            if(!cliente){
                throw new Error ('Ese cliente no existe')
            }
            //verificar si el vendedor es quien edita
            
            //eliminar el cliente
            await Cliente.findOneAndDelete({_id : id});
            return "Cliente Eliminado";            
        },
        nuevoPedido: async (_,{input},ctx) =>{
            const {cliente,empleado} = input
            //verificar si el cliente existe o no
            let clienteExiste = await Cliente.findById(cliente);
            
            if(!clienteExiste){
                throw new Error ('Ese cliente no existe')
            }
            //verificar si el cliente es del vendedor
            let usuarioExiste = await Usuario.findById(empleado);
            if(!usuarioExiste){
                throw new Error('El usuario no existe')
            }
            const nuevoPedido = new Pedido(input);
            //Guardarlo en la base de datos       
            const resultado = await nuevoPedido.save();
            return resultado;
        },
        actualizarPedido: async (_,{id,input},ctx) =>{
            const {cliente} = input;
            //verificar si el pedido existe
            const existePedido = await Pedido.findById(id);
            if(!existePedido){
                throw new Error ('El pedido no existe');
            }
            //cliente existe
            const existeCliente = await Cliente.findById(cliente);
            if(!existeCliente){
                throw new Error ('El cliente no existe');
            }
            //Si el cliente y pedido pertence al vendedor
            if(existeCliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales');
            }
            //Revisar el stock
            if(input.pedido){
                for await (const articulo of input.pedido){
                    const {id} = articulo;

                    const producto = await Producto.findById(id);
                    if(articulo.cantidad > producto.existencia){
                        throw new Error (`El articulo: ${producto.nombre} excede la cantidad disponible `);
                    }else{
                        //restar la cantidad a lo disponible
                        producto.existencia = producto.existencia - articulo.cantidad;
                        await producto.save();
                    }
                }
            }   
            //Guardar el pedido
            const resultado = await Pedido.findOneAndUpdate({_id: id},input, {new: true });

            return resultado;
        },
        eliminarPedido: async (_,{id},ctx) =>{
            //revisar que el pedido si exista
            const existePedido = await Pedido.findById(id);
            if(!existePedido){
                throw new Error ('El pedido no existe');
            }
            //asegurarse de que el pedido si pertenece al vendedor
            if(existePedido.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales');
            }
            //eliminar de la base de datos
            await Pedido.findOneAndDelete({_id: id});
            return "Pedido eliminado"
        },
        nuevaEmpresa: async (_,{input},ctx) =>{
            const {email} = input;
            const {rol} = ctx.usuario;

            if(rol !== 'SUPERADMINISTRADOR'){
                throw new Error('no cuentas con las credenciales para registrar una empresa');
            }

            const existeEmpresa = await Empresa.findOne({email});
            if(existeEmpresa){
                throw new Error('La empresa ya esta registrada');
            }
            
            try {
                //guardarlo en la BD
                const empresa = new Empresa(input);
                empresa.save(); //guardarlo
                return empresa; 

            } catch (error) {
                console.log(error);
            }
        },
        eliminarEmpresa: async (_,{id},ctx) =>{
            const existeEmpresa = await Empresa.findById(id);
            console.log(ctx.usuario)
            const {rol} = ctx.usuario;

            if(rol !== 'SUPERADMINISTRADOR'){
                throw new Error('no cuentas con las credenciales para registrar una empresa');
            }

            if(!existeEmpresa){
                throw new Error('no existe esa empresa');
            }

            await Empresa.findOneAndDelete({_id : id});
            return "Empresa eliminada"; 
        },
        actualizarEmpresa: async (_,{id,input},ctx) => {
            let empresa = await Empresa.findById(id);
            const {rol} = ctx.usuario;

            if(rol !== 'SUPERADMINISTRADOR'){
                throw new Error('no cuentas con las credenciales para registrar una empresa');
            }
            
            if(!empresa){
                throw new Error ('La empresa no existe');
            }

            empresa = await Empresa.findOneAndUpdate({_id : id}, input,{new: true});
            return empresa;
        }

    }
}

module.exports = resolvers;