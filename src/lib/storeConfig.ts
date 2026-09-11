/** Configure CEP da loja (só dígitos) para cálculo aproximado de frete. */
export const STORE_CEP_DIGITS =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_STORE_CEP?.replace(/\D/g, "")
    ? String(import.meta.env.VITE_STORE_CEP).replace(/\D/g, "")
    : "";

/** Horários exibidos e usados para aberto/fechado (fuso horário local). */
export const STORE_HOURS = {
  weekday: {
    openMinutes: 6 * 60 + 30, // 06:30
    closeMinutes: 24 * 60, // 00:00 (meia-noite)
  },
  weekend: {
    openMinutes: 6 * 60 + 30, // 06:30
    closeMinutes: 14 * 60, // 14:00
  },
};

function hoursForDay(day: number) {
  return day === 0 || day === 6 ? STORE_HOURS.weekend : STORE_HOURS.weekday;
}

function formatMinutes(minutes: number): string {
  const total = minutes % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function isStoreOpenNow(): boolean {
  const now = new Date();
  const { openMinutes, closeMinutes } = hoursForDay(now.getDay());
  const m = now.getHours() * 60 + now.getMinutes();
  return m >= openMinutes && m < closeMinutes;
}

export function formatStoreHoursLabel(): string {
  const weekday = `Seg–Sex ${formatMinutes(STORE_HOURS.weekday.openMinutes)} às ${formatMinutes(STORE_HOURS.weekday.closeMinutes)}`;
  const weekend = `Sáb–Dom ${formatMinutes(STORE_HOURS.weekend.openMinutes)} às ${formatMinutes(STORE_HOURS.weekend.closeMinutes)}`;
  return `${weekday} • ${weekend}`;
}

export const FRETE_FALLBACK = 8;
export const FRETE_MESMO_5DIG = 6;
export const FRETE_MESMO_4DIG = 7;
export const FRETE_DEMAIS = 12;
