import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { buildStoreWhatsAppUrl } from "@/lib/whatsapp";

const DEFAULT_IDLE_MS = 3 * 60 * 1000;
const DEFAULT_COOLDOWN_MS = 5 * 60 * 1000;

function parseMsEnv(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Após um tempo sem interação na página, convida o cliente a falar no WhatsApp da loja.
 * Não envia mensagem sozinha ao aparelho — abre o WhatsApp com texto pronto (wa.me).
 * Envio automático para o número do cliente exige WhatsApp Cloud API no servidor.
 */
const IdleWhatsAppNudge = () => {
  const location = useLocation();
  const lastActivityRef = useRef(Date.now());
  const lastNudgeRef = useRef(0);

  const idleMs = parseMsEnv(import.meta.env.VITE_IDLE_WHATSAPP_MS, DEFAULT_IDLE_MS);
  const cooldownMs = parseMsEnv(import.meta.env.VITE_IDLE_WHATSAPP_COOLDOWN_MS, DEFAULT_COOLDOWN_MS);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/admin")) return;

    const bump = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"] as const;
    events.forEach(ev => document.addEventListener(ev, bump, { passive: true }));

    const onVisible = () => {
      if (document.visibilityState === "visible") bump();
    };
    document.addEventListener("visibilitychange", onVisible);

    const tickMs = 5000;
    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (location.pathname.startsWith("/admin")) return;

      const now = Date.now();
      const idleFor = now - lastActivityRef.current;
      if (idleFor < idleMs) return;
      if (now - lastNudgeRef.current < cooldownMs) return;

      lastNudgeRef.current = now;
      lastActivityRef.current = now;

      const text =
        "Oi! Estava vendo o site da Lanchonete Vó Lena e quero falar sobre o cardápio ou delivery. 🥟";

      toast("Ainda precisa de ajuda?", {
        description: "Toque para conversar com a loja no WhatsApp.",
        duration: 20_000,
        action: {
          label: "WhatsApp",
          onClick: () => window.open(buildStoreWhatsAppUrl(text), "_blank", "noopener,noreferrer"),
        },
      });
    }, tickMs);

    return () => {
      events.forEach(ev => document.removeEventListener(ev, bump));
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(interval);
    };
  }, [location.pathname, idleMs, cooldownMs]);

  return null;
};

export default IdleWhatsAppNudge;
