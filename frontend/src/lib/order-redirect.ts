export const LAST_ORDER_KEY = "naqa_last_order_id";

export function storeLastOrderId(orderId: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(LAST_ORDER_KEY, orderId);
  }
}

export function getLastOrderId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(LAST_ORDER_KEY);
}

export function getThankYouPath(orderId: string): string {
  return `/thank-you?orderId=${encodeURIComponent(orderId)}`;
}
