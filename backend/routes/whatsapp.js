const express = require('express')
const router = express.Router()

const whatsappController = require('../controllers/whatsappController')

router.post('/enviar', whatsappController.enviar)
router.post('/enviar-grupo', whatsappController.enviarGrupo)

module.exports = router