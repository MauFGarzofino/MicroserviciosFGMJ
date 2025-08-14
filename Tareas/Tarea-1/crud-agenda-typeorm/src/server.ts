import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import { AppDataSource } from './database/db';
import agendaRoutes from './routes/agenda.routes';

const app = express();
const PORT = Number(process.env.PORT || 5000);

// Vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(process.cwd(), 'public')));

AppDataSource.initialize()
    .then(() => {
        console.log('Conectado a la base de datos');
        app.use('/', agendaRoutes);
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((err: unknown) => {
        console.error('Error al inicializar la base de datos:', err);
    });
