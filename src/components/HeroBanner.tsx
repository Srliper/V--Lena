import { Flame } from "lucide-react";
import heroFundoRealista from "@/assets/hero-coxinha-pastel-realista.png";

/**
 * Fundo com foto (coxinhas, pastéis e molhos) + gradientes (tons quentes da lanchonete).
 */
function FundoProprio() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <img
        src={heroFundoRealista}
        alt=""
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-amber-950/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-950/70 via-black/20 to-black/25" />
    </div>
  );
}

/** Arte vetorial original: molhos (garrafa + gotas). */
function GraficoMolhos({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 88" className={className} fill="none" aria-hidden>
      <path
        d="M38 6h24l4 14v52a10 10 0 0 1-10 10H44a10 10 0 0 1-10-10V20l4-14Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        className="text-amber-100/90"
      />
      <path d="M42 22h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-200/80" />
      <ellipse cx="50" cy="48" rx="10" ry="14" className="fill-amber-400/25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 72c4-8 10-8 14 0s10 8 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-orange-300/70" />
      <circle cx="22" cy="78" r="4" className="fill-orange-300/50" />
      <circle cx="78" cy="76" r="3.5" className="fill-orange-200/45" />
    </svg>
  );
}

/** Arte vetorial original: bebidas (lata + copo + bolhas). */
function GraficoBebidas({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 88" className={className} fill="none" aria-hidden>
      <rect x="12" y="18" width="28" height="58" rx="6" stroke="currentColor" strokeWidth="2.2" className="text-amber-50/85" />
      <path d="M16 28h20M16 38h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-amber-200/60" />
      <path d="M52 24h36v52H52a8 8 0 0 1-8-8V32a8 8 0 0 1 8-8Z" stroke="currentColor" strokeWidth="2.2" className="text-amber-100/90" />
      <path d="M58 36h24M58 46h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-amber-200/55" />
      <circle cx="78" cy="14" r="5" className="stroke-amber-200/70" strokeWidth="1.8" />
      <circle cx="88" cy="22" r="3" className="fill-amber-300/35" />
      <circle cx="70" cy="20" r="2.5" className="fill-amber-200/40" />
    </svg>
  );
}

/** Arte vetorial original: delivery (moto + caixa térmica). */
function GraficoDelivery({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 88" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="deliveryBox" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="deliveryBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fb923c" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* speed lines */}
      <path d="M6 45h10M4 53h14M8 61h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-200/70" />
      {/* thermal box */}
      <rect x="45" y="18" width="30" height="20" rx="4" fill="url(#deliveryBox)" stroke="currentColor" strokeWidth="2.2" className="text-amber-50/95" />
      <path d="M51 25h18M51 31h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-amber-200/65" />
      {/* bike body */}
      <path d="M33 54h18l9-12h11l8 12" stroke="url(#deliveryBody)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 42l-4-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-amber-100/85" />
      <circle cx="30" cy="66" r="11" stroke="currentColor" strokeWidth="2.4" className="text-amber-100/90" />
      <circle cx="80" cy="66" r="11" stroke="currentColor" strokeWidth="2.4" className="text-amber-100/90" />
      <circle cx="30" cy="66" r="3.2" className="fill-amber-200/70" />
      <circle cx="80" cy="66" r="3.2" className="fill-amber-200/70" />
      <path d="M30 66l3-4M80 66l3-4" stroke="#fff7ed" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M25 44h14l8 10"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-amber-100/85"
      />
      {/* location pin hint */}
      <path d="M89 22c0-4 3-7 7-7s7 3 7 7c0 5-7 12-7 12s-7-7-7-12Z" transform="translate(-11 0)" className="fill-red-400/75 stroke-red-200/80" strokeWidth="1.4" />
      <circle cx="85" cy="22" r="2.1" className="fill-amber-50/90" />
    </svg>
  );
}

const faixasFundo = [
  { titulo: "Molhos", subtitulo: "A parte no pedido", Grafico: GraficoMolhos },
  { titulo: "Bebidas", subtitulo: "Geladas na hora", Grafico: GraficoBebidas },
  { titulo: "Delivery", subtitulo: "Entrega rapida", Grafico: GraficoDelivery },
] as const;

const HeroBanner = () => {
  return (
    <section className="relative min-h-[380px] overflow-hidden md:min-h-[480px]">
      <FundoProprio />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex justify-center px-2 pb-2 md:px-4 md:pb-4">
        <div className="grid w-full max-w-4xl grid-cols-3 gap-1.5 md:gap-3">
          {faixasFundo.map(({ titulo, subtitulo, Grafico }) => (
            <div
              key={titulo}
              className={`relative overflow-hidden rounded-2xl border px-1 py-2 shadow-lg backdrop-blur-sm md:rounded-3xl md:px-3 md:py-4 ${
                titulo === "Delivery"
                  ? "border-orange-300/50 bg-gradient-to-b from-orange-900/60 to-red-950/70 shadow-orange-900/40"
                  : "border-amber-200/30 bg-gradient-to-b from-amber-950/50 to-amber-950/75"
              }`}
            >
              <div className="mx-auto flex w-full max-w-[110px] flex-col items-center md:max-w-none">
                <Grafico className="h-14 w-full max-w-[5.5rem] text-amber-50 md:h-20 md:max-w-[7.5rem]" />
                <p className="mt-1 text-center font-heading text-[10px] font-bold uppercase tracking-wide text-amber-100 md:text-sm">
                  {titulo}
                </p>
                <p className="hidden text-center text-[9px] text-amber-200/85 sm:block md:text-xs">{subtitulo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-[2] container mx-auto flex min-h-[380px] flex-col justify-center px-4 pb-36 pt-10 md:min-h-[480px] md:pb-44 md:pt-14">
        <div className="max-w-xl text-primary-foreground drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
          <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 md:text-sm">
            Pastelaria &middot; Lanchonete &middot; Delivery
          </p>
          <h2 className="font-heading text-3xl font-extrabold leading-tight md:text-5xl">
            O melhor da hora,
            <br />
            na sua mesa
          </h2>
          <p className="mt-3 max-w-md font-body text-sm text-amber-50/95 md:text-lg">
            Na Vo Lena, cada detalhe foi pensado para lembrar os melhores momentos em familia: atendimento proximo, ambiente leve e aquele jeitinho caseiro que faz todo mundo se sentir em casa.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#cardapio"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
            >
              Ver Cardapio
            </a>
            <a
              href="#promocoes"
              className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg transition-opacity hover:opacity-90 animate-pulse-promo"
            >
              <Flame className="mr-2 h-4 w-4" />
              Promocoes
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
