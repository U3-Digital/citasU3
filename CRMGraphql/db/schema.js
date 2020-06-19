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
    }
    type Producto{
        id: ID
        nombre: String
        precio: Float
    }

    type Cliente{
        id: ID
        nombre: String
        apellido: String
        email: String
        telefono: String
        status: StatusUsuario
        #vendedor: ID
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
    }

    type TopCliente{
        total: Float
        cliente: [Cliente] 
    }

    type TopVendedor{
        total: Float
        vendedor: [Usuario]
    }
    
    input UsuarioInput {
        nombre: String!
        apellido : String!
        email: String!
        password: String!
        telefono: String!
        status: StatusUsuario!
        rol: rolUsuario!
    }

    input AutenticarInput{
        email: String!
        password: String!
    }

    input ProductoInput{
        nombre: String!
        precio: Float!
    }

    input ClienteInput{
        nombre: String!
        apellido: String!
        email: String!
        telefono: String!
        status: StatusUsuario!
        password: String!

    }

    input PedidoProductoInput{
        id: ID 
        nombre: String
        precio: Float
    }

    input PedidoInput{
        pedido: [PedidoProductoInput]!
        total: Float!
        cliente : ID!
        empleado: ID!
        fecha: String!
        estado: EstadoPedido!
    }

    enum EstadoPedido{
        PENDIENTE
        COMPLETADO
        LISTADO
    }

    enum StatusUsuario{
        BUENO
        MALO
    }

    enum rolUsuario{
        ADMINISTRADOR
        EMPLEADO
    }

    type Query{
        #usuarios
        obtenerUsuario : Usuario
        #Productos
        obtenerProductos: [Producto]
        obtenerProducto(id: ID!): Producto
        #clientes
        obtenerClientes: [Cliente]
        obtenerClientesVendedor: [Cliente]
        obtenerCliente(id: ID!): Cliente
        #pedidos
        obtenerPedidos: [Pedido]
        obtenerPedidosVendedor : [Pedido]
        obtenerPedido(id: ID!) : Pedido
        obtenerPedidosEstado (estado: String!): [Pedido]
        #Busquedas Avanzadas
        mejoresClientes: [TopCliente]
        mejoresVendedores: [TopVendedor]

        buscarProducto(texto: String!): [Producto]

    }
    type Mutation {
        # Usuarios
        nuevoUsuario(input: UsuarioInput ) : Usuario
        autenticarUsuario(input: AutenticarInput) : Token


        # Productos
        nuevoProducto(input: ProductoInput) : Producto
        actualizarProducto(id: ID!, input : ProductoInput) : Producto
        eliminarProducto(id: ID!): String

        #Clientes
        nuevoCliente(input: ClienteInput): Cliente
        actualizarCliente(id: ID!, input: ClienteInput): Cliente
        eliminarCliente(id: ID!): String

        #Pedidos
        nuevoPedido(input: PedidoInput): Pedido
        actualizarPedido(id: ID!, input: PedidoInput ) : Pedido
        eliminarPedido(id: ID!) : String
    }
`;
module.exports = typeDefs;