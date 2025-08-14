import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import agendaApiRouter from './routes.js';
import webRouter from './web.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/api/agenda', agendaApiRouter);
app.use('/', webRouter);

const port = 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));
