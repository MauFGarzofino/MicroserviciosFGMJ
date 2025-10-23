// src/routes/VerifyToken.js
const jwt = require('jsonwebtoken');
const { jwt: jwtCfg } = require('../config/config');

function verifyToken(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(403).send({ auth: false, message: 'No token provided.' });

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer')
    return res.status(400).send({ auth: false, message: 'Invalid Authorization header.' });

  const token = parts[1];
  jwt.verify(token, jwtCfg.secret, (err, decoded) => {
    if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    // decoded => { sub, role, iat, exp }
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  });
}

// Autorización por rol mínimo (admin > seller > buyer)
function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).send({ message: 'Unauthorized' });
    if (!allowed.includes(req.user.role))
      return res.status(403).send({ message: 'Forbidden: insufficient role' });
    next();
  };
}

module.exports = { verifyToken, requireRole };
