import { getApiBaseUrl } from "@/lib/apiBaseUrl";

const API = getApiBaseUrl();

export interface RateStatus {
  ok: boolean;
  status?: string;
  canRate?: boolean;
  alreadyRated?: boolean;
}

export async function fetchRateStatus(orderId: string): Promise<RateStatus> {
  const res = await fetch(`${API}/api/orders/${encodeURIComponent(orderId)}/rate-status`);
  if (!res.ok) return { ok: false };
  return (await res.json()) as RateStatus;
}

export async function submitOrderFeedback(
  orderId: string,
  stars: number,
  comment: string,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${API}/api/orders/${encodeURIComponent(orderId)}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stars, comment }),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok) return { ok: false, error: data.error || "Nao foi possivel enviar a avaliacao." };
  return { ok: true };
}

export interface OrderFeedbackRow {
  orderId: string;
  stars: number;
  comment: string;
  createdAt: string;
  customerName?: string;
  total?: number;
}

export async function fetchFeedbacksAdmin(token: string): Promise<OrderFeedbackRow[]> {
  const res = await fetch(`${API}/api/feedbacks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Falha ao carregar avaliacoes.");
  return (await res.json()) as OrderFeedbackRow[];
}
