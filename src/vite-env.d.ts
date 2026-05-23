/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** CEP da loja ( só dígitos ) — usado para cálculo aproximado de frete no carrinho */
  readonly VITE_STORE_CEP?: string;
  /** DDI + DDD + número, só dígitos */
  readonly VITE_WHATSAPP_BUSINESS_NUMBER?: string;
  /** Tempo sem interação antes do lembrete WhatsApp (ms) */
  readonly VITE_IDLE_WHATSAPP_MS?: string;
  /** Intervalo mínimo entre lembretes (ms) */
  readonly VITE_IDLE_WHATSAPP_COOLDOWN_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
