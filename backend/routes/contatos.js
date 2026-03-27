const express = require('express');
const router = express.Router();

const contatosController = require('../controllers/contatosController');

router.post(
  '/buscar-id',
  contatosController.buscarContatoId
);

module.exports = router;