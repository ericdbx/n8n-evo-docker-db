const axios = require('axios');
const pool = require('../db');

exports.enviar = async (req, res) => {

  try {

    const { conversa_id, mensagem } = req.body;
    
    const dados = await pool.query(`
      SELECT
        ct.numero,
        i.nome_instancia
      FROM conversas c
      JOIN contatos ct ON ct.id = c.contato_id
      JOIN instancias_whatsapp i ON i.id = c.instancia_id
      WHERE c.id = $1
    `,[conversa_id]);

    if (dados.rows.length === 0) {
      return res.status(404).json({erro:"conversa não encontrada"});
    }

    const numero = dados.rows[0].numero;
    const instancia = dados.rows[0].nome_instancia;
    console.log(process.env.EVOLUTION_API);
    // envia via evolution
    await axios.post(
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
    );

    // salva mensagem no banco

    await pool.query(
      `INSERT INTO mensagens
      (conversa_id, remetente, tipo, conteudo)
      VALUES ($1,$2,$3,$4)`,
      [
        conversa_id,
        'empresa',
        'text',
        mensagem
      ]
    );

    res.json({ok:true});

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro:"erro ao enviar mensagem"
    });

  }

};