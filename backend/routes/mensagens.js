const express = require('express')
const router = express.Router()

const mensagemController = require('../controllers/mensagemController')

router.get('/:conversaId', mensagemController.listar)

router.post('/', mensagemController.criar)

module.exports = router