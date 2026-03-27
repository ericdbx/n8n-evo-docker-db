require('dotenv').config()

const express = require('express')
const cors = require('cors')

const webhookRoutes = require('./routes/webhook')
const mensagensRoutes = require('./routes/mensagens')
const conversasRoutes = require('./routes/conversas')
const whatsappRoutes = require('./routes/whatsapp')
const envioRoutes = require('./routes/envio')
const usuariosRoutes = require('./routes/usuarios');
const chamadosRoutes = require('./routes/chamados');
const contatosRoutes = require('./routes/contatos');
const capturaRoutes = require('./routes/captura')


const app = express()

app.use(cors())
app.use(express.json())

app.use('/webhook', webhookRoutes)
app.use('/mensagens', mensagensRoutes)
app.use('/conversas', conversasRoutes)
app.use('/whatsapp', whatsappRoutes)
app.use('/envio', envioRoutes)
app.use('/usuarios', usuariosRoutes);
app.use('/chamados', chamadosRoutes);
app.use('/contatos', contatosRoutes);
app.use('/captura', capturaRoutes)



app.listen(3000, () => {
  console.log('Backend rodando na porta 3000')
})