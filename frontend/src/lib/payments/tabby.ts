import { products } from "@/lib/products";
import type { CountryCode } from "@/lib/pricing";
import type { CartItem } from "@/lib/cart-context";
import { toMajorDecimalString } from "./amount";

export function isTabbyConfigured(): boolean {
  return Boolean(process.env.TABBY_SECRET_KEY && process.env.TABBY_MERCHANT_CODE);
}

/** KSA has its own base URL; UAE/Kuwait use the shared one. See docs/checkout/api/tabby.md */
function tabbyBaseUrl(country: CountryCode): string {
  return country === "SA" ? "https://api.tabby.sa" : "https://api.tabby.ai";
}

interface TabbyCustomer {
  name: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
}

interface CreateTabbySessionInput {
  orderId: string;
  amount: number; // major units — the server-recomputed total
  currency: string;
  country: CountryCode;
  items: CartItem[];
  customer: TabbyCustomer;
  lang?: "ar" | "en";
}

export interface TabbySessionResult {
  tabbySessionId: string;
  status: string;
  webUrl: string | null;
  rejectionReason?: string;
}

export async function createTabbySession(
  input: CreateTabbySessionInput
): Promise<TabbySessionResult> {
  const secretKey = process.env.TABBY_SECRET_KEY;
  const merchantCode = process.env.TABBY_MERCHANT_CODE;
  if (!secretKey || !merchantCode) {
    throw new Error("Tabby is not configured (TABBY_SECRET_KEY / TABBY_MERCHANT_CODE)");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://naqabeauty.store";

  const orderItems = input.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Unknown product id ${item.productId}`);
    return {
      title: product.name,
      quantity: item.quantity,
      unit_price: toMajorDecimalString(input.currency, product.price),
      reference_id: String(product.id),
      category: "beauty",
    };
  });

  const body = {
    payment: {
      amount: toMajorDecimalString(input.currency, input.amount),
      currency: input.currency,
      description: "طلب نقاء للتجميل الفاخر",
      buyer: {
        name: input.customer.name,
        email: input.customer.email || `${input.customer.phone}@naqabeauty.store`,
        phone: input.customer.phone,
      },
      shipping_address: {
        city: input.customer.city,
        address: input.customer.address,
        zip: "",
      },
      order: {
        reference_id: input.orderId,
        items: orderItems,
      },
    },
    lang: input.lang ?? "ar",
    merchant_code: merchantCode,
    merchant_urls: {
      success: `${siteUrl}/checkout/success?orderId=${input.orderId}&gw=tabby`,
      cancel: `${siteUrl}/checkout/cancel?orderId=${input.orderId}&gw=tabby`,
      failure: `${siteUrl}/checkout/failure?orderId=${input.orderId}&gw=tabby`,
    },
  };

  const res = await fetch(`${tabbyBaseUrl(input.country)}/api/v2/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Tabby session creation failed: ${res.status} ${JSON.stringify(data)}`);
  }

  const webUrl: string | null =
    data?.configuration?.available_products?.installments?.[0]?.web_url ?? null;

  return {
    tabbySessionId: data.id,
    status: data.status,
    webUrl,
    rejectionReason: data.status === "rejected" ? data?.rejection_reason : undefined,
  };
}

/** Re-fetch a payment before trusting its status (webhook / return route). */
export async function getTabbyPayment(paymentId: string, country: CountryCode) {
  const secretKey = process.env.TABBY_SECRET_KEY;
  if (!secretKey) throw new Error("TABBY_SECRET_KEY is not set");
  const res = await fetch(`${tabbyBaseUrl(country)}/api/v2/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch Tabby payment ${paymentId}: ${res.status}`);
  return res.json();
}

/** Capture funds for an AUTHORIZED payment. */
export async function captureTabbyPayment(
  paymentId: string,
  amount: string,
  country: CountryCode
) {
  const secretKey = process.env.TABBY_SECRET_KEY;
  if (!secretKey) throw new Error("TABBY_SECRET_KEY is not set");
  const res = await fetch(`${tabbyBaseUrl(country)}/api/v2/payments/${paymentId}/captures`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error(`Failed to capture Tabby payment ${paymentId}: ${res.status}`);
  return res.json();
}
