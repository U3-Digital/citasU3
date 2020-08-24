const { gql} = require('apollo-server');
//schema
const typeDefs = gql`

    type Token {
        token: String
    }

    type Usuario{
        id: ID
        nombre: String
        apellido: String
        email: String
        telefono: String
        status: StatusUsuario
        rol: rolUsuario
        empresa: Empresa
    }
    type Producto{
        id: ID
        nombre: String
        precio: Float
        empresa: ID
    }

    type Cliente{
        id: ID
        nombre: String
        apellido: String
        email: String
        telefono: String
        status: StatusCliente
        empresa: [Empresa]
    }

    type PedidoGrupo{
        id: ID 
        nombre: String
        precio: Float
    }


    type Pedido{
        id: ID 
        pedido: [PedidoGrupo]
        total: Float
        cliente : Cliente
        empleado : Usuario
        fecha: String 
        estado: EstadoPedido
        empresa: ID
        cupon: Cupon
    }


    type PedidoCliente{
        id: ID 
        pedido: [PedidoGrupo]
        total: Float
        cliente : Cliente
        empleado : Usuario
        fecha: String 
        estado: EstadoPedido
        empresa: Empresa
        cupon: Cupon
    }

    type TopCliente{
        total: Float
        cliente: [Cliente] 
    }

    type TopVendedor{
        total: Float
        vendedor: [Usuario]
    }

    type Fotos{
        foto: String
    }

    type Empresa{
        id:ID
        nombre: String
        direccion: String
        email: String
        facebook: String
        instagram: String
        whatsapp: String
        fotos: String
        status: StatusEmpresa
    }

    type Cupon{
        id: ID
        nombre: String
        descuento: Float
        vigencia: String
        empresa: ID
    }

    type Resumen {
        id: ID
        total: Float
        cantidad: Float
    }

    type Ventas{
        _id: ID
        total: Float
    }

    input CuponInput {
        nombre: String!
        descuento: Float!
        vigencia: String!
        empresa: ID
    }

    input EmpresaInput {
        nombre: String!
        direccion: String!
        email: String!
        facebook: String
        instagram: String
        whatsapp: String
        fotos: String
        status: StatusEmpresa!
    }

    input UsuarioInput {
        nombre: String!
        apellido : String!
        email: String!
        password: String!
        telefono: String!
        status: StatusUsuario!
        rol: rolUsuario!
        empresa: ID
    }

    input UsuarioInputActualizar {
        nombre: String
        apellido : String
        email: String
        password: String
        telefono: String
        status: StatusUsuario
        rol: rolUsuario
        empresa: ID
    }

    input AutenticarInput{
        email: String!
        password: String!
    }

    input AutenticarClienteInput{
        email: String!
        password: String!
    }

    input ProductoInput{
        nombre: String!
        precio: Float!
        empresa: ID
    }

    input ClienteInput{
        nombre: String
        apellido: String
        email: String
        telefono: String
        status: StatusCliente
        password: String,
        empresa: [ID]

    }

    input PedidoProductoInput{
        id: ID 
        nombre: String
        precio: Float
    }

    input PedidoInput{
        pedido: [PedidoProductoInput]
        total: Float
        cliente : ID
        empleado: ID
        fecha: String
        estado: EstadoPedido
        empresa: ID
        cupon: ID

    }

    input CorreoInput{
        destinatario: String!
        sujeto: String!
        cuerpo: String!
    }


    enum EstadoPedido{
        PENDIENTE
        COMPLETADO
        LISTADO
        CANCELADO
    }

    enum StatusUsuario{
        HABILITADO
        DESHABILITADO
    }
    enum StatusCliente{
        PENDIENTE
        HABILITADO
        DESHABILITADO
    }

    enum StatusEmpresa{
        HABILITADO
        DESHABILITADO
    }

    enum rolUsuario{
        SUPERADMINISTRADOR
        ADMINISTRADOR
        EMPLEADO
    }
    enum Intervalo{
        SEMANA
        MES 
        CANCELADO 
        PASADO 
        TODO
    }
    enum Tiempo{
        DIA
        SEMANA
        MES
    }

    type Query{
        #usuarios
        obtenerUsuario : Usuario
        obtenerUnUsuario(id: ID!) : Usuario
        obtenerUsuarios: [Usuario]
        obtenerUsuariosempresa: [Usuario]
        #Productos
        obtenerProductos(id: ID!): [Producto]
        obtenerProducto(id: ID!): Producto
        obtenerProductosEmpresa: [Producto]
        #clientes
        obtenerClientes: [Cliente]
        obtenerClientesEmpresa: [Cliente]
        obtenerClientesPendientesEmpresa: [Cliente]
        obtenerCliente(id: ID!): Cliente
        #pedidos
        obtenerPedidos: [Pedido]
        obtenerPedidosVendedor(intervalo: Intervalo ) : [Pedido]
        obtenerPedidosFecha(fecha: String!): [Pedido]
        obtenerSolicitudesPedidos: [Pedido]
        obtenerPedido(id: ID!) : Pedido
        obtenerPedidosEstado (estado: String!): [Pedido]
        obtenerProximasCitas(id: ID!): [Pedido]

        obtenerCitasCliente(intervalo: Intervalo ): [PedidoCliente]
        #Busquedas Avanzadas
        mejoresClientes: [TopCliente]
        mejoresVendedores: [TopVendedor]
        obteneringresos(tiempo: Tiempo): Resumen
        obtenerEstadisticas(tiempo: Tiempo): [Ventas]
        buscarProducto(texto: String!): [Producto]
        #empresas
        obtenerEmpresas: [Empresa]
        obtenerEmpresa(id:ID!): Empresa
        obtenerMiEmpresa: Empresa
        obtenerMisEmpresas: Cliente
        #cupones
        obtenerCuponesEmpresa: [Cupon]
        obtenerCuponesValidos: [Cupon]
        obtenerUnCupon(id:ID!): Cupon
    }
    type Mutation {
        # Usuarios
        nuevoUsuario(input: UsuarioInput ) : Usuario
        autenticarUsuario(input: AutenticarInput) : Token
        autenticarCliente(input: AutenticarClienteInput) : Token
        eliminarUsuario(id: ID!): String
        actualizarUsuario(id: ID!, input: UsuarioInputActualizar) : Usuario

        # Productos
        nuevoProducto(input: ProductoInput) : Producto
        actualizarProducto(id: ID!, input : ProductoInput) : Producto
        eliminarProducto(id: ID!): String

        #Clientes
        nuevoCliente(input: ClienteInput): Cliente
        actualizarCliente(id: ID!, input: ClienteInput): Cliente
        eliminarCliente(id: ID!): String
        nuevoClienteEmpresa(input: ClienteInput): Cliente
        #Pedidos
        nuevoPedido(input: PedidoInput): Pedido
        actualizarPedido(id: ID!, input: PedidoInput ) : Pedido
        eliminarPedido(id: ID!) : String
    
        #empresas
        nuevaEmpresa(input: EmpresaInput ): Empresa
        eliminarEmpresa(id: ID!): String
        actualizarEmpresa(id: ID! input : EmpresaInput): Empresa

        #cupones
        nuevoCupon(input: CuponInput): Cupon
        eliminarCupon(id: ID!): String

        #correos
        correoEmpresa(input: CorreoInput) : String
        

    }
`;
module.exports = typeDefs;