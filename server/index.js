import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerOrderAutomationWebhook } from "./orderAutomationWebhook.js";
import { registerMercadoPagoRoutes } from "./mercadopagoRoutes.js";
import { getExpectedAdminPassword, requireAdmin, signAdminToken } from "./adminAuth.js";
import { createOrdersStore } from "./ordersDb.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || process.env.API_PORT || 3001);
const HOST = (process.env.API_HOST || "0.0.0.0").trim() || "0.0.0.0";
const DATA_DIR = path.join(__dirname, "data");
const LEGACY_ORDERS_JSON = path.join(DATA_DIR, "orders.json");

app.use(cors({ origin: "*" }));
app.use(express.json());

const N8N_WEBHOOK_URL = (process.env.N8N_WEBHOOK_URL || "").trim();

const notifyN8nOrderCreated = (order) => {
  if (!N8N_WEBHOOK_URL) return;
  fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "order.created", order }),
  }).catch((err) => console.error("[n8n webhook]", err.message));
};

async function main() {
  const ordersStore = await createOrdersStore({
    dataDir: DATA_DIR,
    legacyJsonPath: LEGACY_ORDERS_JSON,
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      database: ordersStore.kind,
      ordersDb: ordersStore.kind === "sqlite" ? path.join(DATA_DIR, "orders.db") : LEGACY_ORDERS_JSON,
    });
  });

  app.post("/api/auth/admin-login", (req, res) => {
    const password = String(req.body?.password ?? "").trim();
    if (password !== getExpectedAdminPassword()) {
      return res.status(401).json({ ok: false, error: "Senha incorreta" });
    }
    return res.json({ ok: true, token: signAdminToken() });
  });

  app.get("/api/orders", requireAdmin, (_req, res) => {
    res.json(ordersStore.listAll());
  });

  app.post("/api/orders", (req, res) => {
    const {
      customerName,
      customerPhone,
      address,
      neighborhood,
      reference,
      paymentMethod,
      changeFor,
      notes,
      itemsSummary,
      total,
    } = req.body ?? {};

    if (!customerName || !customerPhone || !address || !neighborhood || !paymentMethod || !itemsSummary) {
      return res.status(400).send("Dados obrigatorios ausentes");
    }

    const pm = String(paymentMethod);
    const payment_gateway = pm === "online_mercado" ? "mercadopago" : "delivery";
    const paymentStatus = pm === "online_mercado" ? "pending_online" : "offline";

    const order = {
      id: `p-${Date.now()}`,
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      address: String(address).trim(),
      neighborhood: String(neighborhood).trim(),
      reference: String(reference || "").trim(),
      paymentMethod: pm,
      changeFor: Number(changeFor || 0),
      notes: String(notes || "").trim(),
      itemsSummary: String(itemsSummary).trim(),
      total: Number(total),
      status: "pendente",
      createdAt: new Date().toISOString(),
      payment_gateway,
      paymentStatus,
    };

    ordersStore.insert(order);
    notifyN8nOrderCreated(order);
    return res.status(201).json(order);
  });

  registerMercadoPagoRoutes(app);

  registerOrderAutomationWebhook(app);

  app.patch("/api/orders/:id/status", requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body ?? {};
    const valid = ["pendente", "preparando", "saiu", "entregue"];
    if (!valid.includes(status)) return res.status(400).send("Status invalido");

    const updated = ordersStore.updateStatus(id, status);
    if (!updated) return res.status(404).send("Pedido nao encontrado");
    return res.json(updated);
  });

  app.get("/api/orders/:id/rate-status", (req, res) => {
    const status = ordersStore.getRateStatus(req.params.id);
    if (!status.ok) return res.status(404).json({ ok: false });
    return res.json(status);
  });

  app.post("/api/orders/:id/feedback", (req, res) => {
    const stars = req.body?.stars;
    const comment = req.body?.comment ?? "";
    const result = ordersStore.submitFeedback(req.params.id, stars, comment);
    if (!result.ok) return res.status(400).json(result);
    return res.status(201).json({ ok: true });
  });

  app.get("/api/feedbacks", requireAdmin, (_req, res) => {
    res.json(ordersStore.listFeedbacks());
  });

  app.listen(PORT, HOST, () => {
    console.log(`Delivery API listening on http://${HOST}:${PORT}`);
    console.log(`[orders] Armazenamento: ${ordersStore.kind}`);
  });
}

main().catch((err) => {
  console.error("[api] Falha ao iniciar:", err);
  process.exit(1);
});

try {
  process.stdin.resume();
} catch {
  /* ignore */
}
