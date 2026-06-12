import { products } from "./products";
import { countries, normalizePhone, type CountryCode } from "./pricing";

export interface SheetOrderItem {
  productId: number;
  quantity: number;
  isUpsell?: boolean;
}

export interface SheetOrderPayload {
  date: string;
  timestamp: string;
  orderId: string;
  country: string;
  name: string;
  phone: string;
  product: string;
  sku: string;
  quantity: string;
  itemCount: number;
  hasUpsell: string;
  upsellProduct: string;
  totalPrice: number;
  currency: string;
  status: string;
}

const CALLING_CODES: Record<CountryCode, string> = {
  SA: "966",
  AE: "971",
  KW: "965",
  QA: "974",
  BH: "973",
  OM: "968",
};

function formatSheetDate(date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatPhoneForSheet(phone: string, country: CountryCode): string {
  const normalized = normalizePhone(phone, country);
  const callingCode = CALLING_CODES[country];
  const withoutLeadingZero = normalized.startsWith("0")
    ? normalized.slice(1)
    : normalized;
  return `${callingCode}${withoutLeadingZero}`;
}

export function buildSheetPayload(
  orderId: string,
  name: string,
  phone: string,
  country: CountryCode,
  items: SheetOrderItem[],
  total: number,
  currency: string
): SheetOrderPayload {
  const productNames: string[] = [];
  const skus: string[] = [];
  const quantities: string[] = [];

  const upsellNames: string[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;
    productNames.push(product.name);
    skus.push(product.sku);
    quantities.push(String(item.quantity));
    if (item.isUpsell) upsellNames.push(product.name);
  }

  return {
    date: formatSheetDate(),
    timestamp: new Date().toISOString(),
    orderId,
    country: countries[country].nameAr,
    name: name.trim(),
    phone: formatPhoneForSheet(phone, country),
    product: productNames.join("/"),
    sku: skus.join("/"),
    quantity: quantities.join("/"),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    hasUpsell: upsellNames.length > 0 ? "نعم" : "لا",
    upsellProduct: upsellNames.join("/"),
    totalPrice: total,
    currency,
    status: "جديد",
  };
}

export async function testWebhookReachability(): Promise<{
  reachable: boolean;
  httpStatus?: number;
  hint: string;
}> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return { reachable: false, hint: "GOOGLE_SHEETS_WEBHOOK_URL not set" };
  }

  try {
    const response = await fetch(webhookUrl, { redirect: "follow" });
    const body = await response.text();

    if (body.includes('"status":"ok"')) {
      return { reachable: true, httpStatus: response.status, hint: "public access ok" };
    }

    if (body.includes("Sign in") || body.includes("signin")) {
      return {
        reachable: false,
        httpStatus: response.status,
        hint: "Google login required — redeploy Apps Script with Accès = Tout le monde (Anyone)",
      };
    }

    return {
      reachable: false,
      httpStatus: response.status,
      hint: body.slice(0, 120),
    };
  } catch (err) {
    return {
      reachable: false,
      hint: err instanceof Error ? err.message : "webhook fetch failed",
    };
  }
}

export async function sendOrderWebhook(payload: SheetOrderPayload): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    console.warn("[orders] GOOGLE_SHEETS_WEBHOOK_URL not set — skipping sheet sync");
    return;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  const body = await response.text().catch(() => "");

  if (
    !response.ok ||
    body.includes("<!DOCTYPE") ||
    body.includes("Sign in") ||
    body.includes("Page introuvable")
  ) {
    throw new Error(`Webhook HTTP ${response.status}: ${body.slice(0, 200)}`);
  }

  try {
    const parsed = JSON.parse(body) as { success?: boolean; error?: string };
    if (parsed.success === false) {
      throw new Error(parsed.error || "Webhook returned success:false");
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("success:false")) throw err;
    throw new Error(`Webhook invalid JSON: ${body.slice(0, 120)}`);
  }
}
