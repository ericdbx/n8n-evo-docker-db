const express = require('express')
const router = express.Router()

const capturaController = require('../controllers/capturaController')

router.post('/', capturaController.criar)
router.get('/ultimas-24h', capturaController.ultimas24h)
router.get('/maior-falador-24h', capturaController.maiorFalador24h)

module.exports = router