import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function rowToOrder(row) {
  const order = {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    address: row.address,
    neighborhood: row.neighborhood,
    reference: row.reference || "",
    paymentMethod: row.payment_method,
    changeFor: row.change_for ?? 0,
    notes: row.notes || "",
    itemsSummary: row.items_summary,
    total: row.total,
    status: row.status,
    createdAt: row.created_at,
    payment_gateway: row.payment_gateway || undefined,
    paymentStatus: row.payment_status || undefined,
  };
  if (row.feedback_stars != null) {
    order.feedback = {
      stars: row.feedback_stars,
      comment: row.feedback_comment || "",
      createdAt: row.feedback_created_at,
    };
  }
  return order;
}

function toFeedbackListItem(orderId, stars, comment, createdAt, extra = {}) {
  return {
    orderId,
    stars,
    comment: comment || "",
    createdAt,
    ...extra,
  };
}

function migrateJsonToSqlite(db, legacyJsonPath, dbPath) {
  const count = db.prepare("SELECT COUNT(*) AS c FROM orders").get().c;
  if (count > 0 || !fs.existsSync(legacyJsonPath)) return;
  try {
    const raw = fs.readFileSync(legacyJsonPath, "utf-8");
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length === 0) return;
    const ins = db.prepare(`
      INSERT OR REPLACE INTO orders (
        id, customer_name, customer_phone, address, neighborhood, reference,
        payment_method, change_for, notes, items_summary, total, status,
        created_at, payment_gateway, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const o of arr) {
      ins.run(
        o.id,
        o.customerName,
        o.customerPhone,
        o.address,
        o.neighborhood,
        o.reference ?? "",
        o.paymentMethod,
        Number(o.changeFor ?? 0),
        o.notes ?? "",
        o.itemsSummary,
        Number(o.total),
        o.status ?? "pendente",
        o.createdAt ?? new Date().toISOString(),
        o.payment_gateway ?? null,
        o.paymentStatus ?? null,
      );
    }
    console.log(`[orders] Migrados ${arr.length} pedidos de orders.json para SQLite (${dbPath}).`);
  } catch (e) {
    console.error("[orders] Falha ao migrar orders.json:", e.message);
  }
}

/** SQLite embutido no Node 22+ (`node:sqlite`) — sem pacote npm extra. */
function createSqliteStore(dbPath, legacyJsonPath) {
  return import("node:sqlite").then(({ DatabaseSync }) => {
    if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    const db = new DatabaseSync(dbPath);
    try {
      db.exec("PRAGMA journal_mode=WAL");
    } catch {
      /* ignore */
    }

    db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        address TEXT NOT NULL,
        neighborhood TEXT NOT NULL,
        reference TEXT,
        payment_method TEXT NOT NULL,
        change_for REAL NOT NULL DEFAULT 0,
        notes TEXT,
        items_summary TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pendente',
        created_at TEXT NOT NULL,
        payment_gateway TEXT,
        payment_status TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
      CREATE TABLE IF NOT EXISTS order_feedbacks (
        order_id TEXT PRIMARY KEY,
        stars INTEGER NOT NULL,
        comment TEXT,
        created_at TEXT NOT NULL
      );
    `);

    migrateJsonToSqlite(db, legacyJsonPath, dbPath);

    const findOrder = id =>
      db
        .prepare(
          `SELECT id, status FROM orders WHERE id = ?`,
        )
        .get(id);

    const hasFeedback = id =>
      !!db.prepare(`SELECT 1 FROM order_feedbacks WHERE order_id = ?`).get(id);

    return {
      kind: "sqlite",
      listAll: () => {
        const rows = db
          .prepare(
            `SELECT o.id, o.customer_name, o.customer_phone, o.address, o.neighborhood, o.reference,
                    o.payment_method, o.change_for, o.notes, o.items_summary, o.total, o.status,
                    o.created_at, o.payment_gateway, o.payment_status,
                    f.stars AS feedback_stars, f.comment AS feedback_comment, f.created_at AS feedback_created_at
             FROM orders o
             LEFT JOIN order_feedbacks f ON f.order_id = o.id
             ORDER BY datetime(o.created_at) DESC`,
          )
          .all();
        return rows.map(rowToOrder);
      },
      insert: (order) => {
        db.prepare(
          `INSERT INTO orders (
            id, customer_name, customer_phone, address, neighborhood, reference,
            payment_method, change_for, notes, items_summary, total, status,
            created_at, payment_gateway, payment_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ).run(
          order.id,
          order.customerName,
          order.customerPhone,
          order.address,
          order.neighborhood,
          order.reference ?? "",
          order.paymentMethod,
          Number(order.changeFor ?? 0),
          order.notes ?? "",
          order.itemsSummary,
          Number(order.total),
          order.status,
          order.createdAt,
          order.payment_gateway ?? null,
          order.paymentStatus ?? null,
        );
      },
      updateStatus: (id, status) => {
        db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
        const row = db
          .prepare(
            `SELECT id, customer_name, customer_phone, address, neighborhood, reference,
                    payment_method, change_for, notes, items_summary, total, status,
                    created_at, payment_gateway, payment_status
             FROM orders WHERE id = ?`,
          )
          .get(id);
        return row ? rowToOrder(row) : null;
      },
      getRateStatus: id => {
        const row = findOrder(id);
        if (!row) return { ok: false };
        return {
          ok: true,
          status: row.status,
          canRate: row.status === "entregue",
          alreadyRated: hasFeedback(id),
        };
      },
      submitFeedback: (id, stars, comment) => {
        const row = findOrder(id);
        if (!row) return { ok: false, error: "Pedido nao encontrado." };
        if (row.status !== "entregue") {
          return { ok: false, error: "Avalie somente apos a entrega ser concluida." };
        }
        if (hasFeedback(id)) return { ok: false, error: "Este pedido ja foi avaliado." };
        const n = Math.round(Number(stars));
        if (n < 1 || n > 5) return { ok: false, error: "Escolha de 1 a 5 estrelas." };
        db.prepare(
          `INSERT INTO order_feedbacks (order_id, stars, comment, created_at) VALUES (?, ?, ?, ?)`,
        ).run(id, n, String(comment || "").trim(), new Date().toISOString());
        return { ok: true };
      },
      listFeedbacks: () => {
        const rows = db
          .prepare(
            `SELECT f.order_id, f.stars, f.comment, f.created_at,
                    o.customer_name, o.total
             FROM order_feedbacks f
             JOIN orders o ON o.id = f.order_id
             ORDER BY datetime(f.created_at) DESC`,
          )
          .all();
        return rows.map(r =>
          toFeedbackListItem(r.order_id, r.stars, r.comment, r.created_at, {
            customerName: r.customer_name,
            total: r.total,
          }),
        );
      },
      close: () => db.close(),
    };
  });
}

/** Fallback: arquivo JSON (compatível com qualquer Node). */
function createJsonStore(dataFile, dataDir) {
  const feedbacksFile = path.join(dataDir, "feedbacks.json");
  const readAll = () => {
    try {
      const raw = fs.readFileSync(dataFile, "utf-8");
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };
  const writeAll = (orders) => {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(orders, null, 2), "utf-8");
  };

  const readFeedbacks = () => {
    try {
      const raw = fs.readFileSync(feedbacksFile, "utf-8");
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const writeFeedbacks = list => {
    fs.mkdirSync(path.dirname(feedbacksFile), { recursive: true });
    fs.writeFileSync(feedbacksFile, JSON.stringify(list, null, 2), "utf-8");
  };

  const attachFeedback = orders => {
    const fb = readFeedbacks();
    const byId = new Map(fb.map(f => [f.orderId, f]));
    return orders.map(o => {
      const f = byId.get(o.id);
      return f ? { ...o, feedback: { stars: f.stars, comment: f.comment, createdAt: f.createdAt } } : o;
    });
  };

  return Promise.resolve({
    kind: "json",
    listAll: () =>
      attachFeedback(
        readAll().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
      ),
    insert: (order) => {
      const orders = readAll();
      orders.unshift(order);
      writeAll(orders);
    },
    updateStatus: (id, status) => {
      const orders = readAll();
      const i = orders.findIndex((o) => o.id === id);
      if (i === -1) return null;
      orders[i] = { ...orders[i], status };
      writeAll(orders);
      return orders[i];
    },
    getRateStatus: id => {
      const order = readAll().find(o => o.id === id);
      if (!order) return { ok: false };
      const rated = readFeedbacks().some(f => f.orderId === id);
      return {
        ok: true,
        status: order.status,
        canRate: order.status === "entregue",
        alreadyRated: rated,
      };
    },
    submitFeedback: (id, stars, comment) => {
      const order = readAll().find(o => o.id === id);
      if (!order) return { ok: false, error: "Pedido nao encontrado." };
      if (order.status !== "entregue") {
        return { ok: false, error: "Avalie somente apos a entrega ser concluida." };
      }
      const list = readFeedbacks();
      if (list.some(f => f.orderId === id)) return { ok: false, error: "Este pedido ja foi avaliado." };
      const n = Math.round(Number(stars));
      if (n < 1 || n > 5) return { ok: false, error: "Escolha de 1 a 5 estrelas." };
      list.unshift({
        orderId: id,
        stars: n,
        comment: String(comment || "").trim(),
        createdAt: new Date().toISOString(),
      });
      writeFeedbacks(list);
      return { ok: true };
    },
    listFeedbacks: () => {
      const orders = readAll();
      return readFeedbacks().map(f => {
        const o = orders.find(x => x.id === f.orderId);
        return toFeedbackListItem(f.orderId, f.stars, f.comment, f.createdAt, {
          customerName: o?.customerName,
          total: o?.total,
        });
      });
    },
    close: () => {},
  });
}

/**
 * Pedidos: SQLite via `node:sqlite` (Node 22+), ou `orders.json` se o módulo não existir.
 */
export async function createOrdersStore({ dataDir, legacyJsonPath }) {
  const dbPath = path.join(dataDir, "orders.db");
  const jsonPath = legacyJsonPath || path.join(dataDir, "orders.json");

  try {
    return await createSqliteStore(dbPath, jsonPath);
  } catch (e) {
    console.warn("[orders] SQLite nativo indisponivel; usando orders.json —", e.message);
    if (!fs.existsSync(jsonPath)) {
      fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
      fs.writeFileSync(jsonPath, "[]", "utf-8");
    }
    return createJsonStore(jsonPath, dataDir);
  }
}
