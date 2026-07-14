# Stripe — Card Payments (Payment Element / Express Checkout)

**Source:** https://docs.stripe.com/payments/payment-element ·
https://docs.stripe.com/elements/express-checkout-element ·
https://docs.stripe.com/payments/quickstart

> Availability note: confirm Stripe card acquiring is enabled for your entity in
> KSA. If Stripe is not available for local KSA acquiring at go-live, use it for
> UAE/card and lean on Tabby/Tamara/COD for KSA. This does not change the code
> below — only which methods you enable in the Dashboard.

## Model

Stripe uses a **PaymentIntent**: created server-side with the final amount +
currency; the client confirms it with card details via the Payment Element.
Wallets (Apple Pay / Google Pay) are shown via the **Express Checkout Element**
(see `apple-pay.md`). Recommended for our redirect-light UX: **Payment Element
on-page** (no full redirect), or **Checkout Session** (hosted redirect) if you
prefer the simplest path.

## Install

```bash
npm i stripe @stripe/stripe-js @stripe/react-stripe-js
```

## 1) Server — create a PaymentIntent

`src/lib/payments/stripe.ts`

```ts
import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

In `src/app/api/payments/create-session/route.ts`, for `method === "card"`:

```ts
import { stripe } from "@/lib/payments/stripe";
import { toMinorUnits } from "@/lib/payments/amount";

// amount recomputed server-side from the cart (never trust the client)
const pi = await stripe.paymentIntents.create({
  amount: toMinorUnits(country, serverTotal), // e.g. 199 SAR -> 19900
  currency: currency.toLowerCase(),           // "sar"
  automatic_payment_methods: { enabled: true },
  metadata: { city, address, phone, name, cart: JSON.stringify(items) },
});
return Response.json({ clientSecret: pi.client_secret });
```

`src/lib/payments/amount.ts`

```ts
const THREE_DECIMAL = new Set(["KWD", "BHD", "OMR"]);
export function toMinorUnits(currency: string, major: number): number {
  const factor = THREE_DECIMAL.has(currency.toUpperCase()) ? 1000 : 100;
  return Math.round(major * factor);
}
```

## 2) Client — Payment Element

Because our checkout page currently redirects for electronic methods, the
cleanest change is to mount the Payment Element inside the page when the user
selects "card" and `create-session` returned a `clientSecret`:

```tsx
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

<Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
  <CardForm />
</Elements>

// inside CardForm, on submit:
const { error } = await stripe.confirmPayment({
  elements,
  confirmParams: { return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success` },
});
```

Use `appearance` to theme it (see `design-rules.md`): black text, gold accent
`#C8A24A`, rounded inputs.

## 3) Webhook — the only place you mark an order paid

`src/app/api/payments/stripe/webhook/route.ts` (Node runtime, raw body):

```ts
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response("bad signature", { status: 400 });
  }
  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    // idempotent: skip if an order with this pi.id already exists
    await saveOrder(/* rebuild from pi.metadata, status: paid, method: card */);
  }
  return Response.json({ received: true });
}
```

Register the webhook URL `https://naqabeauty.store/api/payments/stripe/webhook`
in the Stripe Dashboard and copy the signing secret to `STRIPE_WEBHOOK_SECRET`.

## Test cards

- Success: `4242 4242 4242 4242`, any future date, any CVC.
- mada test card (KSA): use the mada test PAN from Stripe test docs.
- 3DS required: `4000 0027 6000 3184`.

## Checklist

- [ ] `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` set
- [ ] `create-session` returns `clientSecret` for `card`
- [ ] Payment Element themed on-brand, `return_url` → `/checkout/success`
- [ ] Webhook verifies signature + is idempotent + creates the order
- [ ] Amount recomputed server-side in minor units
- [ ] mada enabled in Dashboard (KSA)
