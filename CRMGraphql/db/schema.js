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
        empresa: Empresa
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

    
    input EmpresaInput {
        nombre: String!
        direccion: String!
        email: String!
        facebook: String
        instagram: String
        whatsapp: String
        fotos: String!
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

    input AutenticarInput{
        email: String!
        password: String!
    }

    input ProductoInput{
        nombre: String!
        precio: Float!
        empresa: ID!
    }

    input ClienteInput{
        nombre: String!
        apellido: String!
        email: String!
        telefono: String!
        status: StatusCliente!
        password: String!,
        empresa: ID!

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

    type Query{
        #usuarios
        obtenerUsuario : Usuario
        obtenerUnUsuario(id: ID!) : Usuario
        obtenerUsuarios: [Usuario]
        #Productos
        obtenerProductos(id: ID!): [Producto]
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
        #empresas
        obtenerEmpresas: [Empresa]
        obtenerEmpresa(id:ID!): Empresa
    }
    type Mutation {
        # Usuarios
        nuevoUsuario(input: UsuarioInput ) : Usuario
        autenticarUsuario(input: AutenticarInput) : Token
        eliminarUsuario(id: ID!): String

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
    
        #empresas
        nuevaEmpresa(input: EmpresaInput ): Empresa
        eliminarEmpresa(id: ID!): String
        actualizarEmpresa(id: ID! input : EmpresaInput): Empresa
    }
`;
module.exports = typeDefs;