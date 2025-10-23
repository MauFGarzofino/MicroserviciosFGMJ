// src/routes/LoginController.js
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const User = require('../user/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwt: jwtCfg } = require('../config/config');
const logger = require('../config/log');

// POST /api/v1/login
router.post('/', async (req, res) => {
  try {
    logger.info('[LOGIN] Begin');
    const { email, password } = req.body;
    const user = await User.findOne({ email, state: 'active' }).exec();
    if (!user) return res.status(404).send('No user found.');

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).send({ auth: false, token: null });

    const token = await jwt.sign(
      { sub: user._id.toString(), role: user.role },
      jwtCfg.secret,
      { expiresIn: jwtCfg.expiresIn }
    );

    logger.info('[LOGIN] End (success)');
    res.status(200).send({
      auth: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    logger.error('[LOGIN] Error: ' + err.message);
    res.status(500).send({ message: 'Internal error' });
  }
});

module.exports = router;
