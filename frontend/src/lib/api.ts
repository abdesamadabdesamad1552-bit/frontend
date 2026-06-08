const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/* ━━━ Orders ━━━ */

export interface OrderPayload {
  name: string;
  phone: string;
  country: string;
  items: { productId: number; quantity: number; isUpsell?: boolean }[];
  total: number;
  currency: string;
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  message: string;
}

export function submitOrder(payload: OrderPayload): Promise<OrderResponse> {
  return request<OrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ━━━ GeoIP ━━━ */

export interface GeoResponse {
  country: string;
  source: string;
}

export function detectCountry(): Promise<GeoResponse> {
  return request<GeoResponse>("/api/geo/detect");
}

/* ━━━ Health ━━━ */

export function checkHealth(): Promise<{ status: string }> {
  return request<{ status: string }>("/api/health");
}
