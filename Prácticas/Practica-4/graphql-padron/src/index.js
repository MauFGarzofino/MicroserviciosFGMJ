require("reflect-metadata");
const { DataSource } = require("typeorm");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const createResolvers = require("./schema/resolvers");
const typeDefs = require("./schema/typeDefs");

const Mesa = require("./entity/Mesa");
const Padron = require("./entity/Padron");

const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3307,
    username: "appuser",
    password: "apppass",
    database: "graphql_practica",
    synchronize: true,
    logging: false,
    entities: [Mesa, Padron],
});
async function startServer() {
    const app = express();
    const resolvers = createResolvers(AppDataSource);
    console.log("🧩 Resolvers cargados:", Object.keys(resolvers));

    const server = new ApolloServer({
        typeDefs,
        resolvers
    });
    await server.start();
    server.applyMiddleware({ app });
    await AppDataSource.initialize();
    console.log("✅Conectado a la base de datos");
    app.listen(4000, () => {
        console.log(`🚀Servidor listo en http://localhost:4000${server.graphqlPath}`);
    });
}
startServer();