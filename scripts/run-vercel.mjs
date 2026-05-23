/**
 * Vercel CLI com certificados do Windows (antivírus/proxy corporativo).
 * Uso: npm run vercel -- [args]   ou   node scripts/run-vercel.mjs
 */
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const env = { ...process.env, NODE_OPTIONS: "--use-system-ca" };
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(npx, ["vercel", ...args], { stdio: "inherit", env, shell: true });

process.exit(result.status === null ? 1 : result.status);
