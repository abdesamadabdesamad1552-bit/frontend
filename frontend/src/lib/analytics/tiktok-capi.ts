import crypto from "crypto";
import type { CountryCode } from "@/lib/pricing";

/**
 * TikTok Events API (server-side Conversions API), v1.3.
 * https://business-api.tiktok.com/open_api/v1.3/event/track/
 *
 * Complements the client-side TikTok Pixel (NEXT_PUBLIC_TIKTOK_PIXEL_ID in
 * AnalyticsPixels.tsx) with a server-fired "CompletePayment" event once an
 * order is actually confirmed — more reliable than client-only tracking
 * (ad blockers, iOS ITP, etc.) and the standard e-commerce CAPI pattern.
 *
 * Best-effort only: never throws. A tracking failure must never block order
 * creation or payment confirmation.
 */

const CALLING_CODES: Record<CountryCode, string> = {
  SA: "966",
  AE: "971",
  KW: "965",
  QA: "974",
  BH: "973",
  OM: "968",
};

export function isTikTokCapiConfigured(): boolean {
  return Boolean(process.env.TIKTOK_ACCESS_TOKEN && process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID);
}

function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Normalized local digits (e.g. "0512345678") -> E.164 (e.g. "+966512345678") before hashing. */
function toE164(localDigits: string, country: CountryCode): string {
  const withoutLeadingZero = localDigits.replace(/^0+/, "");
  return `+${CALLING_CODES[country]}${withoutLeadingZero}`;
}

export interface TikTokPurchaseItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TikTokPurchaseEventInput {
  orderId: string;
  /** Already normalized local digits, e.g. from normalizePhone(). */
  phone: string;
  country: CountryCode;
  currency: string;
  value: number;
  items: TikTokPurchaseItem[];
}

export async function sendTikTokPurchaseEvent(input: TikTokPurchaseEventInput): Promise<void> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const pixelCode = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  if (!accessToken || !pixelCode) return;

  const body = {
    event_source: "web",
    event_source_id: pixelCode,
    data: [
      {
        event: "CompletePayment",
        event_time: Math.floor(Date.now() / 1000),
        // Same id every retry for this order -> TikTok dedupes automatically.
        event_id: input.orderId,
        user: {
          phone: sha256Hex(toE164(input.phone, input.country)),
        },
        properties: {
          currency: input.currency,
          value: input.value,
          contents: input.items.map((item) => ({
            content_id: item.id,
            content_name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    ],
  };

  try {
    const res = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: {
        "Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[tiktok-capi] event/track failed (${res.status}):`, text.slice(0, 300));
      return;
    }

    console.log(`[tiktok-capi] CompletePayment sent for ${input.orderId}`);
  } catch (err) {
    console.error("[tiktok-capi] request failed:", err instanceof Error ? err.message : err);
  }
}
