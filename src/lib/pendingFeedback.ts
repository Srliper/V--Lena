const RATE_ORDER_KEY = "volena_rate_order_id";

export function setPendingRateOrderId(orderId: string): void {
  sessionStorage.setItem(RATE_ORDER_KEY, orderId);
}

export function getPendingRateOrderId(): string | null {
  return sessionStorage.getItem(RATE_ORDER_KEY);
}

export function clearPendingRateOrderId(): void {
  sessionStorage.removeItem(RATE_ORDER_KEY);
}
