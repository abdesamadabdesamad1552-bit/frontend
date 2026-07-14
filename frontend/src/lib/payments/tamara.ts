import { products } from "@/lib/products";
import type { CountryCode } from "@/lib/pricing";
import type { CartItem } from "@/lib/cart-context";

export function isTamaraConfigured(): boolean {
  return Boolean(process.env.TAMARA_API_TOKEN);
}

/** Set TAMARA_ENV=sandbox while testing; defaults to production. */
function tamaraBaseUrl(): string {
  return process.env.TAMARA_ENV === "sandbox"
    ? "https://api-sandbox.tamara.co"
    : "https://api.tamara.co";
}

interface TamaraCustomer {
  name: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
}

interface CreateTamaraSessionInput {
  orderId: string;
  amount: number; // major units — the server-recomputed total
  currency: string;
  country: CountryCode;
  items: CartItem[];
  customer: TamaraCustomer;
  locale?: "ar_SA" | "en_US";
}

export interface TamaraSessionResult {
  tamaraOrderId: string;
  checkoutId: string;
  checkoutUrl: string;
  status: string;
}

export async function createTamaraSession(
  input: CreateTamaraSessionInput
): Promise<TamaraSessionResult> {
  const token = process.env.TAMARA_API_TOKEN;
  if (!token) throw new Error("TAMARA_API_TOKEN is not set");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://naqabeauty.store";

  const items = input.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Unknown product id ${item.productId}`);
    return {
      name: product.name,
      type: "Beauty",
      reference_id: String(product.id),
      sku: product.sku,
      quantity: item.quantity,
      unit_price: { amount: product.price, currency: input.currency },
      total_amount: { amount: product.price * item.quantity, currency: input.currency },
    };
  });

  const [firstName, ...rest] = input.customer.name.trim().split(/\s+/);
  const lastName = rest.join(" ") || firstName;

  const body = {
    order_reference_id: input.orderId,
    total_amount: { amount: input.amount, currency: input.currency },
    shipping_amount: { amount: 0, currency: input.currency },
    tax_amount: { amount: 0, currency: input.currency },
    locale: input.locale ?? "ar_SA",
    is_mobile: false,
    payment_type: "PAY_BY_LATER" as const,
    consumer: {
      first_name: firstName,
      last_name: lastName,
      phone_number: input.customer.phone,
      email: input.customer.email || `${input.customer.phone}@naqabeauty.store`,
      country_code: input.country,
    },
    shipping_address: {
      first_name: firstName,
      last_name: lastName,
      line1: input.customer.address,
      city: input.customer.city,
      country_code: input.country,
      phone_number: input.customer.phone,
    },
    items,
    merchant_url: {
      success: `${siteUrl}/checkout/success?orderId=${input.orderId}&gw=tamara`,
      failure: `${siteUrl}/checkout/failure?orderId=${input.orderId}&gw=tamara`,
      cancel: `${siteUrl}/checkout/cancel?orderId=${input.orderId}&gw=tamara`,
      notification: `${siteUrl}/api/payments/tamara/webhook`,
    },
    expires_in_minutes: 30,
  };

  const res = await fetch(`${tamaraBaseUrl()}/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Tamara session creation failed: ${res.status} ${JSON.stringify(data)}`);
  }

  return {
    tamaraOrderId: data.order_id,
    checkoutId: data.checkout_id,
    checkoutUrl: data.checkout_url,
    status: data.status,
  };
}

/** Retrieve an order by Tamara's own id — the webhook only reliably gives you
 * this id, so use it to look up `order_reference_id` (our own order id). */
export async function getTamaraOrder(tamaraOrderId: string) {
  const token = process.env.TAMARA_API_TOKEN;
  if (!token) throw new Error("TAMARA_API_TOKEN is not set");
  const res = await fetch(`${tamaraBaseUrl()}/orders/${tamaraOrderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch Tamara order ${tamaraOrderId}: ${res.status}`);
  return res.json();
}

export async function authoriseTamaraOrder(tamaraOrderId: string) {
  const token = process.env.TAMARA_API_TOKEN;
  if (!token) throw new Error("TAMARA_API_TOKEN is not set");
  const res = await fetch(`${tamaraBaseUrl()}/orders/${tamaraOrderId}/authorise`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to authorise Tamara order ${tamaraOrderId}: ${res.status}`);
  return res.json();
}
