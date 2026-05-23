import crypto from "node:crypto";

const TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Segredo HMAC: ADMIN_TOKEN_SECRET se definido; senão a mesma base da senha admin. */
function adminSecret() {
  const tokenSecret = (process.env.ADMIN_TOKEN_SECRET ?? "").trim();
  if (tokenSecret.length > 0) return tokenSecret;
  const pwd = (process.env.ADMIN_PASSWORD ?? "").trim();
  if (pwd.length > 0) return pwd;
  return "7778";
}

export function getExpectedAdminPassword() {
  const pwd = (process.env.ADMIN_PASSWORD ?? "").trim();
  return pwd.length > 0 ? pwd : "7778";
}

export function signAdminToken() {
  const exp = Date.now() + TTL_MS;
  const payload = Buffer.from(JSON.stringify({ exp, sub: "admin" }), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", adminSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return false;
  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expectedSig = crypto.createHmac("sha256", adminSecret()).update(payload).digest("base64url");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expectedSig, "utf8");
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const m = /^Bearer\s+(.+)$/i.exec(auth);
  const token = m?.[1]?.trim();
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: "Nao autorizado" });
  }
  next();
}
