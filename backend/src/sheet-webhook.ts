import { productCatalog } from "./product-catalog.js";

const CALLING_CODES: Record<string, string> = {
  SA: "966",
  AE: "971",
  KW: "965",
  QA: "974",
  BH: "973",
  OM: "968",
};

const COUNTRY_NAMES: Record<string, string> = {
  SA: "السعودية",
  AE: "الإمارات",
  KW: "الكويت",
  QA: "قطر",
  BH: "البحرين",
  OM: "عمان",
};

function formatSheetDate(date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatPhoneForSheet(phone: string, country: string): string {
  let digits = phone.trim().replace(/[\s\-().]/g, "");
  const callingCode = CALLING_CODES[country] || "966";

  if (digits.startsWith(`+${callingCode}`)) {
    digits = digits.slice(callingCode.length + 1);
  } else if (digits.startsWith(callingCode)) {
    digits = digits.slice(callingCode.length);
  }

  if ((country === "SA" || country === "AE") && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return `${callingCode}${digits}`;
}

export interface SheetOrderItem {
  productId: number;
  quantity: number;
  isUpsell?: boolean;
}

export function buildSheetPayload(
  orderId: string,
  name: string,
  phone: string,
  country: string,
  items: SheetOrderItem[],
  total: number,
  currency: string
) {
  const productNames: string[] = [];
  const skus: string[] = [];
  const quantities: string[] = [];

  const upsellNames: string[] = [];

  for (const item of items) {
    const product = productCatalog[item.productId];
    if (!product) continue;
    productNames.push(product.nameAr);
    skus.push(product.sku);
    quantities.push(String(item.quantity));
    if (item.isUpsell) upsellNames.push(product.nameAr);
  }

  return {
    date: formatSheetDate(),
    timestamp: new Date().toISOString(),
    orderId,
    country: COUNTRY_NAMES[country] || country,
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

export async function sendOrderWebhook(
  payload: ReturnType<typeof buildSheetPayload>
): Promise<void> {
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
