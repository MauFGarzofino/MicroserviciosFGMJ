const express = require('express');
const cors = require('cors');

const app = express();

// 🔹 Configurar CORS (antes de cualquier ruta)
const FRONT_ORIGIN = 'http://localhost:5173';

app.use(cors({
  origin: FRONT_ORIGIN, // origen permitido (frontend)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // usas JWT por header Bearer, no cookies
}));

// (opcional) habilitar preflight explícitamente
app.options('*', cors({
  origin: FRONT_ORIGIN,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// 🔹 Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Inicializa conexión a DB
require('./config/db');

// 🔹 Rutas
const UserController = require('./routes/UserController');
const LoginController = require('./routes/LoginController');
const PruebaController = require('./routes/PruebaController');

app.use('/', PruebaController);
app.use('/api/v1/users', UserController);
app.use('/api/v1/login', LoginController);

// 🔹 Healthcheck (para Docker Compose)
app.get('/health', (req, res) => res.status(200).send({ ok: true }));

module.exports = app;
