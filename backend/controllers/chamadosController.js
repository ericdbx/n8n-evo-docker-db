const pool = require('../db');

exports.buscarChamadoAberto = async (req, res) => {

  try {

    const { usuario_id } = req.params;

    const result = await pool.query(
      `
      SELECT numero, status, assunto
      FROM chamados
      WHERE usuario_id = $1
      AND status != 'finalizado'
      LIMIT 1
      `,
      [usuario_id]
    );

    if (result.rows.length === 0) {
      return res.json({ chamado: null });
    }

    res.json({
      chamado: result.rows[0]
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "erro ao buscar chamado"
    });

  }

};


exports.criar = async (req, res) => {

  try {

    const { empresa_id, usuario_id, filial_id, assunto } = req.body;

    const result = await pool.query(
      `
      INSERT INTO chamados
      (
        empresa_id,
        usuario_id,
        filial_id,
        assunto
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      RETURNING id, numero, assunto, status
      `,
      [
        empresa_id,
        usuario_id,
        filial_id,
        assunto
      ]
    );

    const chamado = result.rows[0];

    res.json({
      chamado_id: chamado.id,
      numero: chamado.numero,
      assunto: chamado.assunto,
      status: chamado.status
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "erro ao criar chamado"
    });

  }

};