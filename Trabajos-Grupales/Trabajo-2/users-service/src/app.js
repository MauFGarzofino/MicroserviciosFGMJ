// src/app.js
const express = require('express');
const app = express();

require('./config/db'); // inicializa conexión

const UserController = require('./routes/UserController');
const LoginController = require('./routes/LoginController');
const PruebaController = require('./routes/PruebaController');

app.use('/', PruebaController);
app.use('/api/v1/users', UserController);
app.use('/api/v1/login', LoginController);

// healthcheck para compose
app.get('/health', (req, res) => res.status(200).send({ ok: true }));

module.exports = app;
