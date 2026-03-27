const axios = require('axios')

exports.enviar = async (req, res) => {

  const { numero, mensagem } = req.body

  try {

    const response = await axios.post(
      `${process.env.EVOLUTION_API}/message/sendText/${instancia}`,
      {
        number: numero,
        text: mensagem
      },
      {
        headers: {
          apikey: process.env.EVOLUTION_API_KEY
        }
      }
    )

    res.json(response.data)

  } catch (err) {

    res.status(500).json({
      erro: err
    })

  }

}

exports.enviarGrupo = async (req, res) => {

  const { grupo_id, mensagem } = req.body

  try {

    if (!grupo_id || !mensagem) {
      return res.status(400).json({
        erro: 'grupo_id e mensagem são obrigatórios'
      })
    }

    const response = await axios.post(
      `${process.env.EVOLUTION_API}/message/sendText/${process.env.EVOLUTION_INSTANCE}`,
      {
        number: grupo_id,
        text: mensagem
      },
      {
        headers: {
          apikey: process.env.EVOLUTION_API_KEY
        }
      }
    )

    res.json(response.data)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      erro: 'erro ao enviar mensagem para o grupo'
    })

  }

}