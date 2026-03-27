const pool = require('../db');

exports.receberWebhook = async (req, res) => {

  try {

    const payload = req.body;

    const evento = payload.event || 'unknown';
    const instancia = payload.instance || null;

    // ==============================
    // SALVAR WEBHOOK BRUTO
    // ==============================

    await pool.query(
      `INSERT INTO webhooks
       (origem, evento, instancia, payload)
       VALUES ($1,$2,$3,$4)`,
      [
        'evolution',
        evento,
        instancia,
        payload
      ]
    );

    // ==============================
    // PROCESSAR APENAS MENSAGENS
    // ==============================

    if (evento !== 'messages.upsert') {
      return res.json({ ok: true });
    }

    const data = payload.body?.data;

    if (!data || !data.key) {
      return res.json({ ok: true });
    }

    const numero =
      data.key.remoteJidAlt?.replace('@s.whatsapp.net','') ||
      data.key.remoteJid?.replace('@s.whatsapp.net','');

    const mensagemId = data.key.id;

    const texto =
      data.message?.conversation ||
      data.message?.extendedTextMessage?.text ||
      null;

    const tipo = data.messageType || 'text';

    const fromMe = data.key.fromMe;

    const remetente = fromMe ? 'empresa' : 'cliente';

    if (!texto) {
      return res.json({ ok: true });
    }

    // ==============================
    // CONTATO
    // ==============================

    let contato = await pool.query(
      `SELECT id FROM contatos WHERE numero = $1`,
      [numero]
    );

    let contatoId;

    if (contato.rows.length === 0) {

      const novoContato = await pool.query(
        `INSERT INTO contatos (empresa_id, numero)
         VALUES (
           (SELECT empresa_id FROM instancias_whatsapp WHERE nome_instancia = $1),
           $2
         )
         RETURNING id`,
        [instancia, numero]
      );

      contatoId = novoContato.rows[0].id;

    } else {

      contatoId = contato.rows[0].id;

    }

    // ==============================
    // CONVERSA
    // ==============================

    let conversa = await pool.query(
      `SELECT id FROM conversas
       WHERE contato_id = $1
       AND status = 'aberta'
       ORDER BY criado_em DESC
       LIMIT 1`,
      [contatoId]
    );

    let conversaId;

    if (conversa.rows.length === 0) {

      const novaConversa = await pool.query(
        `INSERT INTO conversas (contato_id, instancia_id)
         VALUES (
           $1,
           (SELECT id FROM instancias_whatsapp WHERE nome_instancia=$2)
         )
         RETURNING id`,
        [contatoId, instancia]
      );

      conversaId = novaConversa.rows[0].id;

    } else {

      conversaId = conversa.rows[0].id;

    }

    // ==============================
    // EVITAR DUPLICAÇÃO
    // ==============================

    const existe = await pool.query(
      `SELECT id FROM mensagens
       WHERE mensagem_id_whatsapp = $1`,
      [mensagemId]
    );

    if (existe.rows.length === 0) {

      await pool.query(
        `INSERT INTO mensagens
        (conversa_id, remetente, tipo, conteudo, mensagem_id_whatsapp)
        VALUES ($1,$2,$3,$4,$5)`,
        [
          conversaId,
          remetente,
          tipo,
          texto,
          mensagemId
        ]
      );

    }

    return res.json({ ok: true });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      erro: "erro ao processar webhook"
    });

  }

};