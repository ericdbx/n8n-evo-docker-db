const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/usuariosController');

router.post('/validar-telefone', usuariosController.validarTelefone);

router.post('/', usuariosController.criar);

module.exports = router;