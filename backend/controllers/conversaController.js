const pool = require('../db');

exports.listar = async (req, res) => {

  try {

    const conversas = await pool.query(`
      SELECT
        c.id,
        c.status,
        c.criado_em,
        ct.numero,
        ct.nome,

        (
          SELECT conteudo
          FROM mensagens m
          WHERE m.conversa_id = c.id
          ORDER BY criado_em DESC
          LIMIT 1
        ) ultima_mensagem,

        (
          SELECT criado_em
          FROM mensagens m
          WHERE m.conversa_id = c.id
          ORDER BY criado_em DESC
          LIMIT 1
        ) data_ultima_mensagem

      FROM conversas c
      JOIN contatos ct
      ON ct.id = c.contato_id

      ORDER BY data_ultima_mensagem DESC NULLS LAST
    `);

    res.json(conversas.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "erro ao listar conversas"
    });

  }

};

exports.obterOuCriarConversa = async (req, res) => {

  try {

    const { contato_id, instancia_id } = req.body;

    if (!contato_id || !instancia_id) {
      return res.status(400).json({
        erro: "contato_id e instancia_id são obrigatórios"
      });
    }

    // verifica se já existe conversa aberta
    const conversaExistente = await pool.query(
      `SELECT id
       FROM conversas
       WHERE contato_id = $1
       AND instancia_id = $2
       AND status = 'aberta'
       LIMIT 1`,
      [contato_id, instancia_id]
    );

    if (conversaExistente.rows.length > 0) {
      return res.json({
        conversa_id: conversaExistente.rows[0].id,
        criada: false
      });
    }

    // cria nova conversa
    const novaConversa = await pool.query(
      `INSERT INTO conversas (contato_id, instancia_id, status)
       VALUES ($1, $2, 'aberta')
       RETURNING id`,
      [contato_id, instancia_id]
    );

    return res.json({
      conversa_id: novaConversa.rows[0].id,
      criada: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "erro ao obter ou criar conversa"
    });

  }

};