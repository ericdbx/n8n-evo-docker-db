const express = require('express');
const router = express.Router();

const chamadosController = require('../controllers/chamadosController');

router.get('/usuario/:usuario_id/aberto', chamadosController.buscarChamadoAberto);

router.post('/', chamadosController.criar);

module.exports = router;