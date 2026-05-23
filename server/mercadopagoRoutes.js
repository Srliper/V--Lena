/**
 * Mercado Pago — Checkout Preferences (PIX, débito, crédito no checkout oficial).
 * Credenciais: https://www.mercadopago.com.br/developers
 */

const MP_API = "https://api.mercadopago.com/checkout/preferences";

const splitName = (full) => {
  const parts = String(full ?? "")
    .trim()
    .split(/\s+/);
  if (parts.length === 0) return { first: "Cliente", last: "Vo Lena" };
  if (parts.length === 1) return { first: parts[0], last: "-" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
};

export const registerMercadoPagoRoutes = (app) => {
  app.post("/api/payments/mercadopago/preference", async (req, res) => {
    const token = (process.env.MERCADOPAGO_ACCESS_TOKEN || "").trim();
    const frontendOrigin = (
      process.env.MERCADOPAGO_FRONTEND_URL ||
      process.env.SITE_URL ||
      "https://padaria-lanchonete-vo-lena.com.br"
    ).replace(/\/$/, "");
    if (!token) {
      return res.status(503).json({
        ok: false,
        error: "Mercado Pago não configurado. Defina MERCADOPAGO_ACCESS_TOKEN no servidor.",
      });
    }
    if (!frontendOrigin) {
      return res.status(503).json({
        ok: false,
        error: "Defina MERCADOPAGO_FRONTEND_URL (URL pública do site, ex.: https://padaria-lanchonete-vo-lena.com.br) para retorno do checkout.",
      });
    }

    const { orderId, customerName, customerEmail, items, deliveryFee, itemsSummaryNote } = req.body ?? {};
    if (!orderId || typeof orderId !== "string") return res.status(400).json({ ok: false, error: "orderId obrigatorio" });
    if (!customerName || typeof customerName !== "string") return res.status(400).json({ ok: false, error: "customerName obrigatorio" });
    if (!customerEmail || typeof customerEmail !== "string" || !customerEmail.includes("@")) {
      return res.status(400).json({ ok: false, error: "customerEmail obrigatorio (para recibo Mercado Pago)" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: "items deve ser um array nao vazio" });
    }

    const fee = Number(deliveryFee) || 0;
    const mpItems = [];

    for (const row of items) {
      const title = String(row?.title ?? "Item").trim().slice(0, 256);
      const quantity = Math.max(1, Math.floor(Number(row?.quantity ?? 1) || 1));
      let unit_price = Number(row?.unit_price);
      if (!Number.isFinite(unit_price) || unit_price < 0) {
        return res.status(400).json({ ok: false, error: `Preco invalido para: ${title}` });
      }
      unit_price = Math.round(unit_price * 100) / 100;
      mpItems.push({ title, quantity, unit_price, currency_id: "BRL" });
    }

    if (fee > 0) {
      mpItems.push({
        title: "Taxa de entrega",
        quantity: 1,
        unit_price: Math.round(fee * 100) / 100,
        currency_id: "BRL",
      });
    }

    const { first, last } = splitName(customerName);
    const notificationUrl = (process.env.MERCADOPAGO_WEBHOOK_URL || "").trim();

    const body = {
      items: mpItems,
      payer: {
        name: first.slice(0, 50),
        surname: last.slice(0, 50),
        email: customerEmail.trim().toLowerCase().slice(0, 254),
      },
      external_reference: orderId.slice(0, 256),
      metadata: itemsSummaryNote
        ? {
            items_summary_note: String(itemsSummaryNote).slice(0, 500),
            store: "Lanchonete Vo Lena",
          }
        : { store: "Lanchonete Vo Lena" },
      back_urls: {
        success: `${frontendOrigin}/checkout/retorno`,
        failure: `${frontendOrigin}/checkout/retorno`,
        pending: `${frontendOrigin}/checkout/retorno`,
      },
      statement_descriptor: "VO LENA",
      ...(notificationUrl ? { notification_url: notificationUrl } : {}),
      auto_return: "approved",
    };

    try {
      const mpRes = await fetch(MP_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await mpRes.json().catch(() => ({}));
      if (!mpRes.ok) {
        console.error("[mercadopago preference]", mpRes.status, data);
        return res.status(502).json({
          ok: false,
          error: data.message || JSON.stringify(data) || `Mercado Pago erro ${mpRes.status}`,
        });
      }

      const checkoutUrl =
        token.startsWith("TEST-") && data.sandbox_init_point ? data.sandbox_init_point : data.init_point;

      if (!checkoutUrl) {
        return res.status(502).json({ ok: false, error: "Resposta Mercado Pago sem URL de checkout" });
      }

      return res.status(200).json({
        ok: true,
        preference_id: data.id,
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point,
        checkout_url: checkoutUrl,
      });
    } catch (e) {
      console.error("[mercadopago]", e.message);
      return res.status(502).json({ ok: false, error: e.message });
    }
  });
};
