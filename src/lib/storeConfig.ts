/** Configure CEP da loja (só dígitos) para cálculo aproximado de frete. */
export const STORE_CEP_DIGITS =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_STORE_CEP?.replace(/\D/g, "")
    ? String(import.meta.env.VITE_STORE_CEP).replace(/\D/g, "")
    : "";

/** Seg–Dom, horários exibidos e usados para aberto/fechado (fus horário local). */
export const STORE_HOURS = {
  weekdays: [0, 1, 2, 3, 4, 5, 6] as const,
  openMinutes: 6 * 60 + 30, // 06:30
  closeMinutes: 22 * 60, // 22:00
};

export function isStoreOpenNow(): boolean {
  const now = new Date();
  const d = now.getDay();
  if (!STORE_HOURS.weekdays.includes(d as (typeof STORE_HOURS.weekdays)[number])) return false;
  const m = now.getHours() * 60 + now.getMinutes();
  return m >= STORE_HOURS.openMinutes && m < STORE_HOURS.closeMinutes;
}

export function formatStoreHoursLabel(): string {
  const o = `${Math.floor(STORE_HOURS.openMinutes / 60)}:${String(STORE_HOURS.openMinutes % 60).padStart(2, "0")}`;
  const c = `${Math.floor(STORE_HOURS.closeMinutes / 60)}:${String(STORE_HOURS.closeMinutes % 60).padStart(2, "0")}`;
  return `Seg–Dom ${o} às ${c}`;
}

export const FRETE_FALLBACK = 8;
export const FRETE_MESMO_5DIG = 6;
export const FRETE_MESMO_4DIG = 7;
export const FRETE_DEMAIS = 12;
