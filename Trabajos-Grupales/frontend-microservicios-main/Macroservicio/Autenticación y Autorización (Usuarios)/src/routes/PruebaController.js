// src/routes/PruebaController.js
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const logger = require('../config/log');

router.get('/', (req, res) => {
  logger.info('Ingreso a Prueba');
  res.status(200).send({ Mensaje: 'Esta es una prueba' });
});

module.exports = router;
