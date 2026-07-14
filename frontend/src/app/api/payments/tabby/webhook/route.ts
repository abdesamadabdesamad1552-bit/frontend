/**
 * Tabby webhook. Register the URL in the Tabby Merchant Dashboard.
 *
 * IMPORTANT: the exact payload shape below is our best documented
 * understanding (see docs/checkout/api/tabby.md) — verify field names
 * against a real webhook delivery in the Tabby dashboard/sandbox before
 * going live, and adjust the payload interface if needed. We never trust
 * the payload status directly: we always re-fetch the payment from Tabby's
 * API before capturing / marking an order paid.
 */
import { markOrderPaid } from "@/lib/db";
import { captureTabbyPayment, getTabbyPayment } from "@/lib/payments/tabby";
import type { CountryCode } from "@/lib/pricing";

interface TabbyWebhookPayload {
  id?: string;
  status?: string;
  order?: { reference_id?: string };
  payment?: {
    id?: string;
    currency?: string;
    order?: { reference_id?: string };
  };
}

function countryFromCurrency(currency: string | undefined): CountryCode {
  if (currency === "KWD") return "KW";
  if (currency === "AED") return "AE";
  return "SA";
}

export async function POST(request: Request) {
  if (!process.env.TABBY_SECRET_KEY) {
    return new Response("Tabby webhook not configured", { status: 501 });
  }

  let payload: TabbyWebhookPayload;
  try {
    payload = (await request.json()) as TabbyWebhookPayload;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const paymentId = payload.payment?.id ?? payload.id;
  const orderReferenceId = payload.payment?.order?.reference_id ?? payload.order?.reference_id;
  const country = countryFromCurrency(payload.payment?.currency);

  if (!paymentId || !orderReferenceId) {
    console.warn("[tabby webhook] missing payment id or order reference id:", payload);
    return Response.json({ received: true });
  }

  try {
    // Always re-verify with Tabby's API — never trust the webhook body alone.
    const payment = await getTabbyPayment(paymentId, country);

    if (payment.status === "AUTHORIZED") {
      await captureTabbyPayment(paymentId, payment.amount, country);
      await markOrderPaid(orderReferenceId, paymentId, "tabby");
    } else if (payment.status === "CLOSED") {
      // Already captured (e.g. auto-capture enabled on the account).
      await markOrderPaid(orderReferenceId, paymentId, "tabby");
    } else {
      console.log(`[tabby webhook] ${orderReferenceId} payment status: ${payment.status} — no action`);
    }
  } catch (err) {
    console.error("[tabby webhook] verification/capture failed:", err);
    return new Response("Processing error", { status: 500 });
  }

  return Response.json({ received: true });
}
