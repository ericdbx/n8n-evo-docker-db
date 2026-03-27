const pool = require('../db');

exports.validarTelefone = async (req, res) => {

  try {

    const { telefone } = req.body;

    const result = await pool.query(
      `
      SELECT id, ativo, empresa_id
      FROM usuarios
      WHERE telefone = $1
      LIMIT 1
      `,
      [telefone]
    );

    if (result.rows.length === 0) {
      return res.json({ status: "nao_encontrado" });
    }

    const usuario = result.rows[0];

    if (usuario.ativo) {

      return res.json({
        status: "ativo",
        usuario_id: usuario.id,
        empresa_id: usuario.empresa_id
      });

    }

    return res.json({
      status: "inativo",
      usuario_id: usuario.id,
      empresa_id: usuario.empresa_id
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "erro ao validar telefone"
    });

  }

};


exports.criar = async (req, res) => {

  try {

    const { telefone, empresa_id } = req.body;

    const result = await pool.query(
      `
      INSERT INTO usuarios
      (
        empresa_id,
        telefone,
        tipo,
        ativo
      )
      VALUES
      (
        $1,
        $2,
        'usuario',
        false
      )
      RETURNING id
      `,
      [empresa_id, telefone]
    );

    res.json({
      ok: true,
      usuario_id: result.rows[0].id
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "erro ao criar usuario"
    });

  }

};