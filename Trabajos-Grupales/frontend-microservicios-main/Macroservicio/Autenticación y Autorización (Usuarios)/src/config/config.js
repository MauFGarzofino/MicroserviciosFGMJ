// src/config/config.js
module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'sup6546ersecreto',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h', // '24h' o '86400'
  },
};
