require("reflect-metadata");
const { DataSource } = require("typeorm");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./schema/typeDefs");
const createResolvers = require("./schema/resolvers");

const Libro = require("./entity/Libro");
const Prestamo = require("./entity/Prestamo");

const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3308,
    username: "appuser",
    password: "apppass",
    database: "biblioteca_db",
    synchronize: true,
    logging: false,
    entities: [Libro, Prestamo],
});

async function start() {
    await AppDataSource.initialize();
    console.log("✅ Conectado a MySQL");

    const resolvers = createResolvers(AppDataSource);

    const app = express();
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log(`🚀 http://localhost:4000${server.graphqlPath}`);
    });
}

start().catch((e) => {
    console.error("❌ Error al iniciar:", e);
    process.exit(1);
});
