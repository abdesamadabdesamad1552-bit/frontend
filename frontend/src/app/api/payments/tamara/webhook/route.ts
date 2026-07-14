/**
 * Tamara notification webhook. Register this URL as `merchant_url.notification`
 * (already done automatically — see src/lib/payments/tamara.ts).
 *
 * Verify the shared token before trusting anything. Confirm the exact
 * delivery mechanism (header vs. query param) against your Tamara dashboard —
 * this handler accepts either, matched against TAMARA_NOTIFICATION_TOKEN.
 */
import { markOrderPaid } from "@/lib/db";
import { authoriseTamaraOrder, getTamaraOrder } from "@/lib/payments/tamara";

interface TamaraWebhookPayload {
  order_id?: string;
  order_status?: string;
}

export async function POST(request: Request) {
  if (!process.env.TAMARA_API_TOKEN) {
    return new Response("Tamara webhook not configured", { status: 501 });
  }

  const expectedToken = process.env.TAMARA_NOTIFICATION_TOKEN;
  if (expectedToken) {
    const url = new URL(request.url);
    const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const providedToken = bearer ?? url.searchParams.get("token");
    if (providedToken !== expectedToken) {
      return new Response("Invalid notification token", { status: 401 });
    }
  }

  let payload: TamaraWebhookPayload;
  try {
    payload = (await request.json()) as TamaraWebhookPayload;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const tamaraOrderId = payload.order_id;
  if (!tamaraOrderId) {
    return Response.json({ received: true });
  }

  try {
    // Re-fetch from Tamara — the notification body alone isn't trusted.
    const order = await getTamaraOrder(tamaraOrderId);
    const orderReferenceId: string | undefined = order?.order_reference_id;
    const status: string | undefined = order?.status ?? payload.order_status;

    if (!orderReferenceId) {
      console.warn("[tamara webhook] no order_reference_id for Tamara order:", tamaraOrderId);
      return Response.json({ received: true });
    }

    if (status === "approved") {
      await authoriseTamaraOrder(tamaraOrderId);
      await markOrderPaid(orderReferenceId, tamaraOrderId, "tamara");
    } else if (status === "authorised" || status === "captured") {
      await markOrderPaid(orderReferenceId, tamaraOrderId, "tamara");
    } else {
      console.log(`[tamara webhook] ${orderReferenceId} status: ${status} — no action`);
    }
  } catch (err) {
    console.error("[tamara webhook] processing failed:", err);
    return new Response("Processing error", { status: 500 });
  }

  return Response.json({ received: true });
}
