/**
 * Automador de pedidos: webhook POST → Evolution API (2 mensagens).
 * POST /api/webhooks/pedidos-automation
 */

const digitsOnly = (s) => String(s ?? "").replace(/\D/g, "");

const formatMoney = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "0,00";
  return v.toFixed(2).replace(".", ",");
};

const formatItemsList = (itens) => {
  if (!Array.isArray(itens) || itens.length === 0) return "(sem itens detalhados)";
  return itens
    .map((i) => {
      const nome = String(i?.nome ?? "Item").trim();
      const qty = Number(i?.qty ?? 1) || 1;
      const preco = Number(i?.preco ?? 0) || 0;
      const sub = qty * preco;
      return `• ${qty}x ${nome} — R$ ${formatMoney(sub)}`;
    })
    .join("\n");
};

const sendEvolutionText = async ({ number, text }) => {
  const base = (process.env.EVOLUTION_API_URL || "http://evolution-api:8080").replace(/\/$/, "");
  const instance = process.env.EVOLUTION_INSTANCE || "vo-lena";
  const apikey = (process.env.EVOLUTION_API_KEY || "").trim();
  if (!apikey) throw new Error("EVOLUTION_API_KEY não configurada");

  const clean = digitsOnly(number);
  if (clean.length < 10) throw new Error("Número de telefone inválido para Evolution");

  const url = `${base}/message/sendText/${encodeURIComponent(instance)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey,
    },
    body: JSON.stringify({ number: clean, text }),
  });

  const bodyText = await res.text();
  if (!res.ok) {
    throw new Error(`Evolution API ${res.status}: ${bodyText.slice(0, 500)}`);
  }
};

const validatePayload = (body) => {
  if (!body || typeof body !== "object") return "JSON inválido";
  const { id, nome, telefone_cliente, itens, total, telefone_dono } = body;
  if (!id || typeof id !== "string") return "Campo id obrigatório (string)";
  if (!nome || typeof nome !== "string") return "Campo nome obrigatório (string)";
  if (!telefone_cliente || typeof telefone_cliente !== "string") return "Campo telefone_cliente obrigatório (string)";
  if (!telefone_dono || typeof telefone_dono !== "string") return "Campo telefone_dono obrigatório (string)";
  if (itens !== undefined && !Array.isArray(itens)) return "Campo itens deve ser um array";
  if (total === undefined || Number.isNaN(Number(total))) return "Campo total obrigatório (number)";
  return null;
};

export const registerOrderAutomationWebhook = (app) => {
  app.post("/api/webhooks/pedidos-automation", async (req, res) => {
    const errMsg = validatePayload(req.body);
    if (errMsg) return res.status(400).json({ ok: false, error: errMsg });

    const { id, nome, telefone_cliente, itens, total, telefone_dono } = req.body;

    const lista = formatItemsList(itens);
    const totalFmt = formatMoney(total);

    const msgCliente =
      `Olá ${nome.trim()}! 🎉 Seu pedido #${id} na Vó Lena foi confirmado!\n` +
      `📋 Itens:\n${lista}\n` +
      `💰 Total: R$ ${totalFmt}\n` +
      `⏱️ Em breve entraremos em contato. Obrigado!`;

    const msgDono =
      `🔔 Novo pedido #${id}!\n` +
      `👤 Cliente: ${nome.trim()}\n` +
      `📱 Telefone: ${telefone_cliente.trim()}\n` +
      `📋 Itens:\n${lista}\n` +
      `💰 Total: R$ ${totalFmt}`;

    let clienteOk = false;
    try {
      await sendEvolutionText({ number: telefone_cliente, text: msgCliente });
      clienteOk = true;
      await sendEvolutionText({ number: telefone_dono, text: msgDono });
      return res.status(200).json({ ok: true, pedido_id: id, enviado: ["cliente", "dono"] });
    } catch (e) {
      console.error("[pedidos-automation]", e.message);
      return res.status(502).json({
        ok: false,
        error: e.message,
        pedido_id: id,
        parcial: { cliente: clienteOk, dono: false },
      });
    }
  });
};
