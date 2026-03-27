const pool = require('../db');

exports.buscarContatoId = async (req, res) => {

  try {

    const { telefone } = req.body;

    if (!telefone) {
      return res.status(400).json({
        erro: "telefone é obrigatório"
      });
    }

    const result = await pool.query(
      `SELECT id FROM contatos WHERE numero = $1 LIMIT 1`,
      [telefone]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        erro: "contato não encontrado"
      });
    }

    res.json({
      contato_id: result.rows[0].id
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "erro ao buscar contato"
    });

  }

};