"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Agenda_1 = require("../entities/Agenda"); // importa tu entidad
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres', // Cambia si usas otro motor
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'agenda_db',
    synchronize: true, // Solo en desarrollo, en prod usar migraciones
    logging: false,
    entities: [Agenda_1.Agenda],
});
