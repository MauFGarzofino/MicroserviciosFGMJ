// src/config/db.js
const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/bd_usuarios';

mongoose.connect(MONGO_URL, { autoIndex: true })
  .then(() => console.log('[Usuarios] Conectado a MongoDB:', MONGO_URL))
  .catch(error => console.error('[Usuarios] Error al conectar a MongoDB:', error));

module.exports = mongoose;
