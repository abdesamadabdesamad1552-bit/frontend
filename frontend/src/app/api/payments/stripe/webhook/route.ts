/**
 * Stripe webhook — the ONLY place a card/Apple Pay order is marked paid.
 * Register this URL in the Stripe Dashboard:
 *   https://naqabeauty.store/api/payments/stripe/webhook
 * and copy the signing secret into STRIPE_WEBHOOK_SECRET.
 */
import type Stripe from "stripe";
import { markOrderPaid } from "@/lib/db";
import { getStripeClient, isStripeConfigured } from "@/lib/payments/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Stripe webhook not configured", { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripeClient().webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata?.order_id;

    if (!orderId) {
      console.warn(
        "[stripe webhook] payment_intent.succeeded with no order_id metadata:",
        paymentIntent.id
      );
      return Response.json({ received: true });
    }

    const wasNewlyMarked = await markOrderPaid(orderId, paymentIntent.id, "stripe");
    console.log(
      `[stripe webhook] ${orderId} -> paid (${wasNewlyMarked ? "confirmed" : "already paid, no-op"})`
    );
  }

  return Response.json({ received: true });
}
