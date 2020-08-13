const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');
const Cupon = require('../models/Cupon');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Empresa = require('../models/Empresa');
const { Error } = require('mongoose');
require('dotenv').config({ path: 'variables.env' });
const nodemailer = require('nodemailer');
const crearToken = (usuario, secreta, expiresIn) => {
    //console.log(usuario);
    const { id, email, nombre, apellido, rol, status, telefono, empresa } = usuario;
    return jwt.sign({ id, email, nombre, apellido, rol, status, telefono, empresa }, secreta, { expiresIn })
}

const crearTokenClientes = (usuario, secreta, expiresIn) => {
    const { id, nombre, apellido, email, empresa, status } = usuario;
    return jwt.sign({ id, nombre, apellido, email, empresa, status }, secreta, { expiresIn })
}

//resolvers
const resolvers = {
    Query: {
        obtenerUsuario: async(_, {}, ctx) => {
            return ctx.usuario;
        },
        obtenerUnUsuario: async(_, { id }, ctx) => {
            if (ctx.usuario.rol !== 'SUPERADMINISTRADOR') {
                throw new Error('No cuentas con las credenciales');
            }
            const existeUsuario = Usuario.findById(id).populate('empresa');
            if (!existeUsuario) {
                throw new Error('El Usuario No Existe');
            }
            return existeUsuario;
        },
        obtenerUsuarios: async(_, {}, ctx) => {
            const { rol } = ctx.usuario;

            if (rol === 'EMPLEADO') {
                throw new Error('no cuenta con las credenciales para esta accion');
            }
            if (rol === 'ADMINISTRADOR') {
                const usuarios = await Usuario.find({ empresa: ctx.usuario.empresa });
                return usuarios;
            }
            if (rol === 'SUPERADMINISTRADOR') {
                const usuarios = await Usuario.find({});
                return usuarios;
            }
            const usuarios = await Usuario.find({ empresa: ctx.usuario.empresa });
            return usuarios;





        },

        obtenerProductos: async(_, { id }) => {
            try {
                const productos = await Producto.find({ empresa: id.toString() });
                return productos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProductosEmpresa: async(_, {}, ctx) => {

            try {
                const productos = await Producto.find({ empresa: ctx.usuario.empresa });

                return productos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProducto: async(_, { id }) => {
            //revisar si el producto existe
            const producto = await Producto.findById(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }
            return producto;
        },
        obtenerClientes: async() => {
            try {
                const clientes = await Cliente.find({}).populate('empresa');
                return clientes;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerClientesEmpresa: async(_, {}, ctx) => {
            //console.log(ctx.usuario);
            try {
                const clientes = await Cliente.find({ empresa: ctx.usuario.empresa.toString(), status: "HABILITADO" });
                return clientes;
            } catch (error) {
                console.log(error);
            }

        },
        obtenerClientesPendientesEmpresa: async(_, {}, ctx) => {
            try {
                const clientes = await Cliente.find({ empresa: ctx.usuario.empresa.toString(), status: "PENDIENTE" }).populate('empresa');
                return clientes;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerCliente: async(_, { id }, ctx) => {

            //revisar si el cliente existe o no
            const cliente = await Cliente.findById(id).populate('empresa');
            if (!cliente) {
                throw new Error('Clidente no encontrado');
            }

            if (ctx.usuario.rol !== "SUPERADMINISTRADOR") {

                if (ctx.usuario.empresa === cliente.empresa.toString()) {
                    throw new Error('No cuentas con las crendenciales para esta accion')
                }
            }

            return cliente;

        },
        obtenerPedidos: async() => {
            try {
                const pedidos = await Pedido.find({});
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedidosVendedor: async(_, { intervalo }, ctx) => {
            const today = new Date(Date.now());
            const week = new Date(Date.now() + 604800000)
            const month = new Date(`${today.getFullYear()}-${today.getMonth()+2}-01`)
            const tomorrow = new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()+1};00:00:00`);

            if (intervalo === "SEMANA") {
                try {
                    const pedidos = await Pedido.find({ empleado: ctx.usuario.id, estado: "LISTADO", fecha: { $gte: today, $lte: week } }, null, { sort: { fecha: 1 } }).populate('cliente');
                    //console.log(ctx.usuario.id);
                    return pedidos;
                } catch (error) {
                    console.log(error);
                }
            }
            if (intervalo === "MES") {
                try {
                    const pedidos = await Pedido.find({ empleado: ctx.usuario.id, estado: "LISTADO", fecha: { $gte: today, $lte: month } }, null, { sort: { fecha: 1 } }).populate('cliente');
                    //console.log(ctx.usuario.id);
                    return pedidos;
                } catch (error) {
                    console.log(error);
                }
            }
            if (intervalo === "CANCELADO") {
                try {
                    const pedidos = await Pedido.find({ empleado: ctx.usuario.id, estado: "CANCELADO" }, null, { sort: { fecha: 1 } }).populate('cliente');
                    //console.log(ctx.usuario.id);
                    return pedidos;
                } catch (error) {
                    console.log(error);
                }
            }
            if (intervalo === "PASADO") {
                try {
                    const pedidos = await Pedido.find({ empleado: ctx.usuario.id, estado: "COMPLETADO" }, null, { sort: { fecha: 1 } }).populate('cliente').populate('cupon');
                    //console.log(ctx.usuario.id);
                    return pedidos;
                } catch (error) {
                    console.log(error);
                }
            }
            try {
                const pedidos = await Pedido.find({ empleado: ctx.usuario.id, estado: "LISTADO", fecha: { $gte: today, $lt: tomorrow } }, null, { sort: { fecha: 1 } }).populate('cliente');
                //console.log(ctx.usuario.id);
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerCitasCliente: async(_, { intervalo }, ctx) => {
            const today = new Date(Date.now());
            const week = new Date(Date.now() + 604800000)
            const month = new Date(`${today.getFullYear()}-${today.getMonth()+2}-01`)

            if (intervalo === "SEMANA") {
                try {
                    const pedidos = await Pedido.find({ cliente: ctx.usuario.id, estado: "LISTADO", fecha: { $gte: today, $lte: week } }, null, { sort: { fecha: 1 } }).populate('cliente');
                    //console.log(ctx.usuario.id);
                    return pedidos;
                } catch (error) {
                    console.log(error);
                }
            }
            if (intervalo === "MES") {
                try {
                    const pedidos = await Pedido.find({ cliente: ctx.usuario.id, estado: "LISTADO", fecha: { $gte: today, $lte: month } }, null, { sort: { fecha: 1 } }).populate('cliente');
                    //console.log(ctx.usuario.id);
                    return pedidos;
                } catch (error) {
                    console.log(error);
                }
            }
            if (intervalo === "CANCELADO") {
                try {
                    const pedidos = await Pedido.find({ cliente: ctx.usuario.id, estado: "CANCELADO" }, null, { sort: { fecha: 1 } }).populate('cliente');
                    //console.log(ctx.usuario.id);
                    return pedidos;
                } catch (error) {
                    console.log(error);
                }
            }
            if (intervalo === "PASADO") {
                try {
                    const pedidos = await Pedido.find({ cliente: ctx.usuario.id, estado: "COMPLETADO" }, null, { sort: { fecha: 1 } }).populate('cliente').populate('cupon');
                    //console.log(ctx.usuario.id);
                    return pedidos;
                } catch (error) {
                    console.log(error);
                }
            }
            try {
                const pedidos = await Pedido.find({ cliente: ctx.usuario.id, estado: "LISTADO" }, null, { sort: { fecha: 1 } }).populate('cliente');
                //console.log(ctx.usuario.id);
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProximasCitas: async(_, { id }, ctx) => {
            const today = new Date(Date.now());
            try {
                const pedidos = await Pedido.find({ cliente: id, fecha: { $gte: today } }, null, { sort: { fecha: 1 } }).limit(5).populate('cliente')
                    //console.logconsole.log(pedidos.length);
                return pedidos;
            } catch (error) {
                console.log(error)
            }

        },
        obtenerSolicitudesPedidos: async(_, {}, ctx) => {

            try {
                const pedidos = await Pedido.find({ empleado: ctx.usuario.id, estado: "PENDIENTE" }).populate('cliente');
                //console.log(ctx.usuario.id);
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedido: async(_, { id }, ctx) => {
            //verificar si el pedido existe
            const pedido = await Pedido.findById(id).populate('cliente');
            if (!pedido) {
                throw new Error('El pedido no existe');
            }
            //Solo quien lo creo puede verlo
            if (pedido.empresa.toString() !== ctx.usuario.empresa) {
                throw new Error('No tienes las credenciales para acceder a este pedido')
            }
            //retornar el resultado
            return pedido;
        },
        obtenerPedidosEstado: async(_, { estado }, ctx) => {
            const pedidos = await Pedido.find({ vendedor: ctx.usuario.id, estado });

            return pedidos;
        },
        obtenerCuponesEmpresa: async(_, {}, ctx) => {
            const cupones = await Cupon.find({ empresa: ctx.usuario.empresa });

            /*cupones.map(cupon =>{
                console.log(cupon.vigencia.toString());
            })*/

            return cupones;
        },
        obtenerCuponesValidos: async(_, {}, ctx) => {
            const today = new Date(Date.now());
            const cupones = await Cupon.find({ empresa: ctx.usuario.empresa, vigencia: { $gt: today } });

            /*cupones.map(cupon =>{
                console.log(cupon.vigencia.toString());
            })*/

            return cupones;
        },
        obtenerEstadisticas: async(_,{tiempo},ctx) =>{
            const {empresa} = ctx.usuario;
            const today = new Date(Date.now());
            const week = new Date(Date.now() -(86400000*(today.getDay())))
            const imonth = new Date(`${today.getFullYear()}-${today.getMonth()+1}-01`)
            const month = new Date(`${today.getFullYear()}-${today.getMonth()+2}-01`)
            const tomorrow = new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()+1};00:00:00`);

            if (tiempo === "SEMANA") {
                const grafica = await Pedido.aggregate([
                    { $match: { estado: "COMPLETADO",fecha: { $gte: week, $lte: today }} },
                    {
                        $group: {
                            _id: "$fecha",
                            total: { $sum: '$total' }
                            
                        }
                    },
                    {
                        $sort: { _id: 1 }
                    }
                ]);
                return grafica;
            }
            if(tiempo === "MES"){
                const grafica = await Pedido.aggregate([
                    { $match: { estado: "COMPLETADO",fecha: { $gte: imonth, $lte: month }} },
                    {
                        $group: {
                            _id: "$fecha",
                            total: { $sum: '$total' }
                            
                        }
                    },
                    {$sort: { _id: 1 }}
                ]);
                return grafica;
            }
            if(tiempo ==="DIA"){
                const grafica = await Pedido.aggregate([
                    { $match: { estado: "COMPLETADO", fecha: { $gte: today, $lte: tomorrow }} },
                    {
                        $group: {
                            _id: "$fecha",
                            total: { $sum: '$total' }
                            
                        }
                    },
                    {$sort: { _id: 1 }}
                ]);
                return grafica;
            }
        },
        obteneringresos: async(_, { tiempo }, ctx) => {
            const {empresa} = ctx.usuario;
            const today = new Date(Date.now());
            const week = new Date(Date.now() -(86400000*(today.getDay())))
            const imonth = new Date(`${today.getFullYear()}-${today.getMonth()+1}-01`)
            const month = new Date(`${today.getFullYear()}-${today.getMonth()+2}-01`)
            const tomorrow = new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()+1};00:00:00`);

            if (tiempo === "SEMANA") {
                const dinero = await Pedido.aggregate([
                    { $match: { estado: "COMPLETADO",fecha: { $gte: week, $lte: today }}},
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$total' },
                            cantidad: { $sum: 1 }

                        }
                    }
                ]);
                console.log(dinero);
                return  dinero[0];
            }
            if (tiempo === "MES") {
                const dinero = await Pedido.aggregate([
                    { $match: {estado: "COMPLETADO", fecha: { $gte: imonth, $lte: month } } },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$total' },
                            cantidad: { $sum: 1 }
                        }
                    }
                ]);
                return dinero[0];
            }
            if(tiempo === "DIA"){
                const dinero = await Pedido.aggregate([
                    { $match: { estado: "COMPLETADO", fecha: { $gte: today, $lte: tomorrow } } },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$total' },
                            cantidad: { $sum: 1 }
                        }
                    }
                ]);
                if(!dinero[0]){
                    return 0;
                }else{
                    return dinero[0];    
                }    
            }


        },
        obtenerUnCupon: async(_, { id }, ctx) => {
            const cupon = await Cupon.findById(id);
            if (!cupon) {
                throw new Error('El cupon no existe');
            }

            return cupon;
        },
        mejoresClientes: async() => {
            const clientes = await Pedido.aggregate([
                { $match: { estado: "COMPLETADO" } },
                {
                    $group: {
                        _id: "$cliente",
                        total: { $sum: '$total' }
                        
                    }
                },
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
                    $sort: { total: -1 }
                }
            ]);
            return clientes;
        },
        mejoresVendedores: async() => {
            const vendedores = await Pedido.aggregate([
                { $match: { estado: "COMPLETADO" } },
                {
                    $group: {
                        _id: "$vendedor",
                        total: { $sum: '$total' }
                    }
                },
                {
                    $lookup: {
                        from: 'usuarios',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'empleado'
                    }
                },
                {
                    $limit: 3
                },
                {
                    $sort: { total: -1 }
                }
            ]);

            return vendedores;
        },
        buscarProducto: async(_, { texto }) => {
            const productos = await Producto.find({ $text: { $search: texto } }).limit(10);

            return productos;
        },
        obtenerEmpresas: async() => {
            try {
                const empresas = await Empresa.find({});
                //console.log(empresas);
                return empresas;
            } catch (error) {
                console.log(error);
            }

        },
        obtenerEmpresa: async(_, { id }, ctx) => {


            const empresa = await Empresa.findById(id);

            if (!empresa) {
                throw new Error('La empresa no existe');
            }

            return empresa;
        },
        obtenerMiEmpresa: async(_, {}, ctx) => {
            const { empresa } = ctx.usuario;
            const miEmpresa = await Empresa.findById(empresa);

            if (!miEmpresa) {
                throw new Error('La empresa no existe');
            }

            return miEmpresa;
        }
    },
    Mutation: {
        nuevoUsuario: async(_, { input }, ctx) => {
            const { email, password, rol, empresa } = input;
            if (!empresa) {
                input.empresa = ctx.usuario.empresa;
            }
            //revisar usuario ya esta registrado
            const existeUsuario = await Usuario.findOne({ email });
            if (existeUsuario) {
                throw new Error('El usuario ya esta registrado');
            }
            if (rol === "SUPERADMINISTRADOR" && empresa !== "") {
                throw new Error('Un superadministrador no puede tener una empresa');
            }

            if (input.empresa === "") {
                input.empresa = null;
            }

            //hashear su password
            const salt = await bcryptjs.genSalt(10);
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
        eliminarUsuario: async(_, { id }, ctx) => {

            const { rol } = ctx.usuario;
            console.log(rol);
            if (rol === "EMPLEADO") {
                throw new Error('no cuentas con las credenciales para registrar un usuario');
            }

            await Usuario.findByIdAndDelete({ _id: id });
            return "Usuario Eliminado";
        },
        actualizarUsuario: async(_, { id, input }, ctx) => {
            const { password } = input;
            //si el usuario existe 
            if (ctx.usuario.rol !== 'SUPERADMINISTRADOR') {
                throw new Error('No cuentas con las credenciales para realizar esta acción');
            }

            const existeUsuario = await Usuario.findById(id);

            if (!existeUsuario) {
                throw new Error('El usuario no existe');
            }
            if (password) {
                //hashear su password
                const salt = await bcryptjs.genSalt(10);
                input.password = await bcryptjs.hash(password, salt);
            }

            const respuesta = await Usuario.findOneAndUpdate({ _id: id }, input, { new: true });
            return respuesta;

        },
        autenticarUsuario: async(_, { input }) => {
            const { email, password } = input;
            //si el usuario existe 
            const existeUsuario = await Usuario.findOne({ email });

            if (!existeUsuario) {
                throw new Error('El usuario no existe');
            }
            //console.log(existeUsuario);
            //revisar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if (!passwordCorrecto) {
                throw new Error('El password es incorrecto');
            }
            if (existeUsuario.status === "DESHABILITADO") {
                throw new Error('El usuario se encuentra suspendio en el sistema');
            }
            if (existeUsuario.empresa) {
                const { empresa } = existeUsuario;
                const empresavalida = await Empresa.findById(empresa);
                if (empresavalida.status !== "HABILITADO") {
                    throw new Error('La empresa no se encuentra activa');

                }
            }
            //console.log(existeUsuario);
            //crear el Token
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24H')
            }

        },
        autenticarCliente: async(_, { input }) => {
            const { email, password, empresa } = input;
            //si el usuario existe 
            const existeCliente = await Cliente.findOne({ email, empresa });
            if (!existeCliente) {
                throw new Error('El Cliente no existe en esta empresa');
            }
            //revisar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeCliente.password);
            if (!passwordCorrecto) {
                throw new Error('El password es incorrecto');
            }


            if (existeCliente.status === "PENDIENTE") {
                throw new Error('Aún no cuentas con la autorización para acceder');
            }

            //crear el Token
            return {
                token: crearTokenClientes(existeCliente, process.env.SECRETA, '24H')
            }
        },
        nuevoProducto: async(_, { input }, ctx) => {
            if (!input.empresa) {
                input.empresa = ctx.usuario.empresa;
            }

            const producto = new Producto(input);
            try {

                const resultado = await producto.save();
                return resultado;
            } catch (error) {
                console.log(error)
            }
        },
        actualizarProducto: async(_, { id, input }) => {
            //revisar si el producto existe
            let producto = await Producto.findById(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }
            //guardarlo en la bd
            producto = await Producto.findOneAndUpdate({ _id: id }, input, { new: true });
            return producto;
        },
        eliminarProducto: async(_, { id }) => {
            //revisar si el producto existe
            let producto = await Producto.findById(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            //Eliminar Producto
            await Producto.findByIdAndDelete({ _id: id });
            return "Producto Eliminado";
        },
        nuevoCliente: async(_, { input }, ctx) => {
            const { email, password, empresa } = input;
            //console.log(ctx);
            //verificar si el cliente ya esta registrado
            //console.log(input);
            const cliente = await Cliente.findOne({ email, empresa });
            if (cliente) {
                throw new Error('Ese Cliente ya esta registrado');
            }
            //hashear
            const salt = await bcryptjs.genSalt(10);
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
        nuevoClienteEmpresa: async(_, { input }, ctx) => {
            const { email, password } = input;
            const { empresa } = ctx.usuario;
            input.empresa = empresa;

            const cliente = await Cliente.findOne({ email, empresa });
            if (cliente) {
                throw new Error('Ese Cliente ya esta registrado');
            }

            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);
            const nuevoCliente = new Cliente(input);

            try {

                const resultado = await nuevoCliente.save();

                return resultado;
            } catch (error) {
                console.log(error)
            }

        },
        actualizarCliente: async(_, { id, input }, ctx) => {

            const { password } = input;
            //verifica sis existe o no
            let cliente = await Cliente.findById(id);
            if (!cliente) {
                throw new Error('Ese cliente no existe')
            }


            if (password) {
                const salt = await bcryptjs.genSalt(10);
                input.password = await bcryptjs.hash(password, salt);
            }

            if (ctx.usuario.rol === "SUPERADMINISTRADOR") {
                cliente = await Cliente.findOneAndUpdate({ _id: id }, input, { new: true });
                return cliente;
            }

            //verificar si el vendedor es quien edita
            if (cliente.empresa.toString() !== ctx.usuario.empresa) {
                throw new Error('No tienes las credenciales');
            }

            //guardar el cliente
            cliente = await Cliente.findOneAndUpdate({ _id: id }, input, { new: true });
            return cliente;
        },
        eliminarCliente: async(_, { id }, ctx) => {
            //verifica sis existe o no
            let cliente = await Cliente.findById(id);
            if (!cliente) {
                throw new Error('Ese cliente no existe')
            }
            //verificar si el vendedor es quien edita
            //borrar sus citas 
            await Pedido.deleteMany({ cliente: id });

            //eliminar el cliente
            await Cliente.findOneAndDelete({ _id: id });

            return "Cliente Eliminado";
        },
        nuevoPedido: async(_, { input }, ctx) => {

            const { empleado, fecha } = input
            let cliente = input.cliente;
            if (!cliente) {
                cliente = ctx.usuario.id
                input.cliente = ctx.usuario.id;
            }
            //verificar si el cliente existe o no
            let clienteExiste = await Cliente.findById(cliente);
            if (!clienteExiste) {
                throw new Error('Ese cliente no existe')
            }
            //verificar si el cliente es del vendedor
            let usuarioExiste = await Usuario.findById(empleado);
            if (!usuarioExiste) {
                throw new Error('El usuario no existe')
            }




            let citaexiste = await Pedido.findOne({
                fecha,
                empleado,
                $or: [
                    { estado: "PENDIENTE", estado: "COMPLETADO", estado: "LISTADO" }
                ]
            });
            if (citaexiste) {
                throw new Error('La fecha ya esta apartada');
            }

            input.empresa = ctx.usuario.empresa;

            const nuevoPedido = new Pedido(input);
            //Guardarlo en la base de datos       
            const resultado = await nuevoPedido.save();
            return resultado;
        },
        actualizarPedido: async(_, { id, input }, ctx) => {
            //verificar si el pedido existe
            const existePedido = await Pedido.findById(id);
            if (!existePedido) {
                throw new Error('El pedido no existe');
            }
            if (!input.cliente) {
                input.cliente = ctx.usuario.id;
            }
            //cliente existe
            const existeCliente = await Cliente.findById(input.cliente);
            console.log(existeCliente);
            if (!existeCliente) {
                throw new Error('El cliente no existe');
            }
            //Si el cliente y pedido pertence al vendedor
            if (existeCliente.empresa.toString() !== ctx.usuario.empresa) {
                throw new Error('No tienes las credenciales');
            }
            //Revisar el stock
            if (input.pedido) {
                for await (const articulo of input.pedido) {
                    const { id } = articulo;

                    const producto = await Producto.findById(id);
                    if (articulo.cantidad > producto.existencia) {
                        throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible `);
                    } else {
                        //restar la cantidad a lo disponible
                        producto.existencia = producto.existencia - articulo.cantidad;
                        await producto.save();
                    }
                }
            }
            try {
                const resultado = await Pedido.findOneAndUpdate({ _id: id }, input, { new: true });
                return resultado;
            } catch (error) {
                console.log(error);
            }
            //Guardar el pedido


        },
        eliminarPedido: async(_, { id }, ctx) => {
            //revisar que el pedido si exista
            const existePedido = await Pedido.findById(id);
            if (!existePedido) {
                throw new Error('El pedido no existe');
            }
            //asegurarse de que el pedido si pertenece al vendedor
            if (existePedido.empresa.toString() !== ctx.usuario.empresa) {
                throw new Error('No tienes las credenciales');
            }
            //eliminar de la base de datos
            await Pedido.findOneAndDelete({ _id: id });
            return "Pedido eliminado"
        },
        nuevaEmpresa: async(_, { input }, ctx) => {
            const { email } = input;
            const { rol } = ctx.usuario;

            if (rol !== 'SUPERADMINISTRADOR') {
                throw new Error('no cuentas con las credenciales para registrar una empresa');
            }

            const existeEmpresa = await Empresa.findOne({ email });
            if (existeEmpresa) {
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
        eliminarEmpresa: async(_, { id }, ctx) => {
            const existeEmpresa = await Empresa.findById(id);
            //console.log(ctx.usuario)
            const { rol } = ctx.usuario;

            if (rol !== 'SUPERADMINISTRADOR') {
                throw new Error('no cuentas con las credenciales para registrar una empresa');
            }

            if (!existeEmpresa) {
                throw new Error('no existe esa empresa');
            }
            await Pedido.deleteMany({ empresa: id });
            await Usuario.deleteMany({ empresa: id });
            await Cliente.deleteMany({ empresa: id });
            await Cupon.deleteMany({ empresa: id });
            await Producto.deleteMany({ empresa: id });
            await Empresa.findOneAndDelete({ _id: id });

            return "Empresa eliminada";
        },
        actualizarEmpresa: async(_, { id, input }, ctx) => {
            let empresa = await Empresa.findById(id);
            const { rol } = ctx.usuario;

            if (rol !== 'SUPERADMINISTRADOR') {
                throw new Error('no cuentas con las credenciales para registrar una empresa');
            }

            if (!empresa) {
                throw new Error('La empresa no existe');
            }

            empresa = await Empresa.findOneAndUpdate({ _id: id }, input, { new: true });
            return empresa;
        },
        nuevoCupon: async(_, { input }, ctx) => {

            const { vigencia } = input;

            input.vigencia = new Date(vigencia).toString();

            if (!input.empresa) {
                input.empresa = ctx.usuario.empresa;

            }
            const cupon = new Cupon(input);

            //console.log(input);
            try {
                cupon.save();
            } catch (error) {
                console.log(error);
            }
            return cupon;

        },
        eliminarCupon: async(_, { id }, ctx) => {
            const existeCupon = await Cupon.findById(id);

            if (!existeCupon) {
                throw new Error('El cupon no existe');
            }

            if (ctx.usuario.rol !== "SUPERADMINISTRADOR" && existeCupon.empresa === ctx.usuario.empresa) {
                throw new Error('No cuntas con las credenciales para esta accion')
            }
            try {
                await Cupon.findOneAndDelete({ _id: id });
                return ('Cupon eliminado');
            } catch (error) {
                console.log(error);
            }
        },
        correoEmpresa: async(_, { input }, ctx) => {
            const { destinatario, sujeto, cuerpo } = input;

            const empresa = await Empresa.findById(ctx.usuario.empresa);
            const { nombre, direccion, email, facebook, instagram, whatsapp } = empresa;
            const mensajeEmpresa = `
            <div  style="background: #3D4B63;">
                <div>
                    <img src="https://u3digital.com.mx/wp-content/uploads/2020/06/u3-1536x1536.png" width="90" height="90" alt=""/>
                </div>
                <div>
                <p>${nombre}</p>
                <p>${direccion}</p><p>${email}</p><p>${facebook}</p><p></p><p></p>	
                </div>
            </div>
            </html>
            
            `

            const transporter = nodemailer.createTransport({
                host: 'mail.u3digital.com.mx',
                port: 465,
                secure: true,
                auth: {
                    user: 'eaguilar@u3digital.com.mx',
                    pass: 'eric123@'
                }
            });

            const mailOptions = {
                from: "eaguilar@u3digital.com.mx",
                to: destinatario,
                subject: `${sujeto}`,
                html: `${cuerpo} ${mensajeEmpresa}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    throw new Error('No me envié :,c')
                } else {
                    return ('Enviado')
                }
            })
        }

    }
}

module.exports = resolvers;