/** DDI+DDD+número, só dígitos (ex.: 5511993394537). */
const DEFAULT_STORE_WHATSAPP = "5515997298054";

export function getStoreWhatsAppDigits(): string {
  const raw = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER ?? DEFAULT_STORE_WHATSAPP;
  return String(raw).replace(/\D/g, "");
}

/** Abre conversa com a loja; `text` é a mensagem já preenchida para o cliente só enviar. */
export function buildStoreWhatsAppUrl(text?: string): string {
  const phone = getStoreWhatsAppDigits();
  const base = `https://wa.me/${phone}`;
  if (text?.trim()) {
    return `${base}?text=${encodeURIComponent(text.trim())}`;
  }
  return base;
}
