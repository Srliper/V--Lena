import { isProductionSiteHost } from "@/lib/siteConfig";

const DEFAULT_API_PORT = "3001";

/**
 * Resolve API URL for local/dev usage.
 * - Honors VITE_API_URL when provided.
 * - Em padaria-lanchonete-vo-lena.com.br: mesmo origin (/api via proxy Vercel).
 * - When app is opened through LAN IP, uses same host with port 3001.
 */
export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    const { protocol, hostname, origin } = window.location;
    if (isProductionSiteHost(hostname)) return origin.replace(/\/+$/, "");

    const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
    const host = isLocalHost ? "localhost" : hostname;
    return `${protocol}//${host}:${DEFAULT_API_PORT}`;
  }

  return `http://localhost:${DEFAULT_API_PORT}`;
}
