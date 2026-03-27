const express = require('express');
const router = express.Router();

const envioController = require('../controllers/envioController');

router.post('/', envioController.enviar);

module.exports = router;