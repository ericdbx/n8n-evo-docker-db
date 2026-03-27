const pool = require('../db');

exports.criar = async (req, res) => {

  try {

    const { nome, msg, created } = req.body;

    if (!nome || !msg || !created) {
      return res.status(400).json({
        erro: "nome, msg e created são obrigatórios"
      });
    }

    const resultado = await pool.query(
      `INSERT INTO captura (nome, msg, created)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [nome, msg, created]
    );

    res.json({
      sucesso: true,
      id: resultado.rows[0].id
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "erro ao salvar captura"
    });

  }

};

exports.ultimas24h = async (req, res) => {

  try {

    const resultado = await pool.query(`

      SELECT
      (
        SELECT STRING_AGG(
          '[' || TO_CHAR(created, 'HH24:MI') || '] ' || nome || ': ' || msg,
          E'\n'
          ORDER BY created
        )
        FROM captura
        WHERE created >= NOW() - INTERVAL '24 hours'
      )

      ||

      E'\n\n🏆 o maior desocupado do dia foi:\n'

      ||

      (
        SELECT STRING_AGG(
          nome || ' com ' || total || ' mensagens',
          E'\n'
        )
        FROM (
          SELECT nome, COUNT(*) AS total
          FROM captura
          WHERE created >= NOW() - INTERVAL '24 hours'
          GROUP BY nome
          ORDER BY total DESC
          LIMIT 1
        ) ranking_maior
      )

     AS contexto

    `);

    res.json({
      contexto: resultado.rows[0].contexto || ""
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "erro ao buscar mensagens"
    });

  }

};

exports.maiorFalador24h = async (req, res) => {

  try {

    const resultado = await pool.query(`
      SELECT
        nome,
        COUNT(*) AS total_mensagens
      FROM captura
      WHERE created >= NOW() - INTERVAL '24 hours'
      GROUP BY nome
      ORDER BY total_mensagens DESC
      LIMIT 1
    `);

    if (resultado.rows.length === 0) {
      return res.json({
        msg: "ninguém enviou mensagens nas últimas 24 horas"
      });
    }

    const nome = resultado.rows[0].nome;
    const quantidade = resultado.rows[0].total_mensagens;

    res.json({
      msg: "o maior falador é o " + nome + " com " + quantidade + " de mensagens"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "erro ao buscar maior falador"
    });

  }

};