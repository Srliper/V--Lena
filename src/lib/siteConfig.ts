/** Domínio oficial em produção (sem barra final). */
export const SITE_HOST = "padaria-lanchonete-vo-lena.com.br";
export const SITE_HOST_WWW = `www.${SITE_HOST}`;
export const SITE_ORIGIN = `https://${SITE_HOST}`;
export const API_SUBDOMAIN_ORIGIN = `https://api.${SITE_HOST}`;

export function isProductionSiteHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === SITE_HOST || h === SITE_HOST_WWW;
}

export function getSiteOrigin(): string {
  if (typeof window !== "undefined" && isProductionSiteHost(window.location.hostname)) {
    return window.location.origin;
  }
  return SITE_ORIGIN;
}
