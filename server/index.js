import "dotenv/config";
import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.API_PORT || 3001);
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "orders.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");

app.use(cors({ origin: "*" }));
app.use(express.json());

const readOrders = () => {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const writeOrders = (orders) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
};

const N8N_WEBHOOK_URL = (process.env.N8N_WEBHOOK_URL || "").trim();

const notifyN8nOrderCreated = (order) => {
  if (!N8N_WEBHOOK_URL) return;
  fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "order.created", order }),
  }).catch((err) => console.error("[n8n webhook]", err.message));
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/orders", (_req, res) => {
  const orders = readOrders();
  res.json(orders);
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

  const order = {
    id: `p-${Date.now()}`,
    customerName: String(customerName).trim(),
    customerPhone: String(customerPhone).trim(),
    address: String(address).trim(),
    neighborhood: String(neighborhood).trim(),
    reference: String(reference || "").trim(),
    paymentMethod: String(paymentMethod),
    changeFor: Number(changeFor || 0),
    notes: String(notes || "").trim(),
    itemsSummary: String(itemsSummary).trim(),
    total: Number(total),
    status: "pendente",
    createdAt: new Date().toISOString(),
  };

  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);
  notifyN8nOrderCreated(order);
  return res.status(201).json(order);
});

app.patch("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body ?? {};
  const valid = ["pendente", "preparando", "saiu", "entregue"];
  if (!valid.includes(status)) return res.status(400).send("Status invalido");

  const orders = readOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return res.status(404).send("Pedido nao encontrado");

  orders[index] = { ...orders[index], status };
  writeOrders(orders);
  return res.json(orders[index]);
});

app.listen(PORT, () => {
  console.log(`Delivery API running on http://localhost:${PORT}`);
});

// Evita encerramento imediato no Windows quando o pai (ex.: concurrently) fecha o stdin.
try {
  process.stdin.resume();
} catch {
  /* ignore */
}
