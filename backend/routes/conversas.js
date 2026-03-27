const express = require('express')
const router = express.Router()

const conversaController = require('../controllers/conversaController')

router.get('/', conversaController.listar)
router.post('/obter-ou-criar', conversaController.obterOuCriarConversa)

module.exports = router 