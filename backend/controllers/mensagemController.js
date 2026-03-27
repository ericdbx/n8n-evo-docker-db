const pool = require('../db');


// LISTAR MENSAGENS
exports.listar = async (req, res) => {

  try {

    const { conversaId } = req.params;

    const mensagens = await pool.query(
      `SELECT *
       FROM mensagens
       WHERE conversa_id = $1
       ORDER BY criado_em ASC`,
      [conversaId]
    );

    res.json(mensagens.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "erro ao buscar mensagens"
    });

  }

};


// CRIAR MENSAGEM
exports.criar = async (req, res) => {

  try {

    const {
      conversa_id,
      remetente,
      tipo,
      conteudo
    } = req.body;

    const result = await pool.query(
      `INSERT INTO mensagens
        (conversa_id, remetente, tipo, conteudo)
       VALUES
        ($1, $2, $3, $4)
       RETURNING *`,
      [conversa_id, remetente,  tipo, conteudo]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "erro ao criar mensagem"
    });

  }

};