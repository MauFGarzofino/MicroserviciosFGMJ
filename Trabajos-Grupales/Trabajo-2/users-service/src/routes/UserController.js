// src/routes/UserController.js
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const User = require('../user/User');
const bcrypt = require('bcryptjs');
const logger = require('../config/log');
const { verifyToken, requireRole } = require('./VerifyToken');

// PUBLIC: Crear usuario (registro)
router.post('/', async (req, res) => {
  try {
    logger.info('[USERS] Register begin');
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email }).exec();
    if (exists) return res.status(409).send({ message: 'El usuario ya existe' });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const nuevoUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role && ['admin', 'seller', 'buyer'].includes(role) ? role : 'buyer',
      state: 'active',
    });

    await nuevoUser.save();
    logger.info('[USERS] Register ok');
    return res.status(201).send({
      id: nuevoUser._id,
      name: nuevoUser.name,
      email: nuevoUser.email,
      role: nuevoUser.role,
      state: nuevoUser.state
    });
  } catch (err) {
    logger.error('[USERS] Register error: ' + err.message);
    return res.status(500).send({ message: 'Internal error' });
  }
});

// PROTECTED: Listar todos (solo admin)
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  logger.info('[USERS] List all');
  const users = await User.find().select('-password').exec();
  res.status(200).send(users);
});

// PROTECTED: Obtener por id (admin o dueño)
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin' && req.user.id !== id)
    return res.status(403).send({ message: 'Forbidden' });

  const user = await User.findById(id).select('-password').exec();
  if (!user) return res.status(404).send('No user found.');
  res.status(200).send(user);
});

// PROTECTED: Actualizar (admin o dueño)
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin' && req.user.id !== id)
    return res.status(403).send({ message: 'Forbidden' });

  // impedir cambio de password/role sin control (puedes reforzar)
  const up = { ...req.body };
  delete up.password; // manejar en endpoint dedicado
  if (req.user.role !== 'admin') delete up.role;

  const updated = await User.findByIdAndUpdate(id, up, { new: true }).select('-password').exec();
  if (!updated) return res.status(404).send('No user found.');
  res.status(200).send(updated);
});

// PROTECTED: Borrado lógico (admin o dueño)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin' && req.user.id !== id)
    return res.status(403).send({ message: 'Forbidden' });

  const updated = await User.findByIdAndUpdate(id, { state: 'inactive' }, { new: true })
    .select('-password').exec();
  if (!updated) return res.status(404).send('No user found.');
  res.status(200).send(updated);
});

module.exports = router;
