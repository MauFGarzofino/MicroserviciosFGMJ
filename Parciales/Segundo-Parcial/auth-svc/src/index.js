import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json());

const PORT = 3001;
const JWT_SECRET = 'jwt_secret';
const DB = { host: 'mysql', user: 'auth_user', password: 'auth_pass', database: 'auth_db' };

const pool = await mysql.createPool(DB);
await pool.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL
  );
`);

const generarToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

app.post('/registrar', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const hash = await bcrypt.hash(contrasena, 10);
    await pool.query('INSERT INTO usuarios (correo, contrasena) VALUES (?, ?)', [correo, hash]);
    res.status(201).json({ mensaje: 'Usuario creado correctamente' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo=?', [correo]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
  const valido = await bcrypt.compare(contrasena, user.contrasena);
  if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });
  const token = generarToken({ id: user.id, correo: user.correo });
  res.json({ token });
});

app.listen(PORT, () => console.log(`auth-svc: ${PORT}`));
