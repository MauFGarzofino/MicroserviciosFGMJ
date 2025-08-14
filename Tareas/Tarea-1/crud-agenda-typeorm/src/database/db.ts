import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Agenda } from '../entities/Agenda'; // importa tu entidad

export const AppDataSource = new DataSource({
    type: 'postgres', // Cambia si usas otro motor
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'agenda_db',
    synchronize: true, // Solo en desarrollo, en prod usar migraciones
    logging: false,
    entities: [Agenda],
});