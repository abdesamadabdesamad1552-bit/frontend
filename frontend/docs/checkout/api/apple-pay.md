# Apple Pay (via Stripe — recommended)

**Source:** https://docs.stripe.com/apple-pay?platform=web ·
https://docs.stripe.com/elements/express-checkout-element

> **Use Stripe for Apple Pay.** Stripe handles Apple merchant validation for you
> — it creates the Apple Merchant ID and the Certificate Signing Request. You do
> **not** need to follow Apple's manual merchant-certificate process, and you do
> **not** need to host the `.well-known/apple-developer-merchantid-domain-association`
> file yourself. This is by far the simplest path and is what our checkout page
> is built for.

## Prerequisites

- Site served over **HTTPS** (production domain `naqabeauty.store`).
- A device/browser that supports Apple Pay: **Safari on iOS 10+ / macOS Sierra+**
  with a card in Wallet. (The page already feature-detects with
  `window.ApplePaySession?.canMakePayments()` and only then shows the button.)
- Stripe account with card payments enabled.

## Step 1 — Register your domain with Stripe (once per domain)

API (use your **live secret key**):

```bash
curl https://api.stripe.com/v1/payment_method_domains \
  -u "$STRIPE_SECRET_KEY:" \
  -d "domain_name=naqabeauty.store"
```

Also register `www.naqabeauty.store` and any subdomain / preview domain you use.
Or do it in the Dashboard → **Settings → Payment method domains**.
(No manual Apple certificate, no `.well-known` upload — Stripe does it.)

## Step 2 — Show Apple Pay with the Express Checkout Element

The Express Checkout Element renders the Apple Pay (and Google Pay / Link)
button automatically when available.

```tsx
import { loadStripe } from "@stripe/stripe-js";
import { Elements, ExpressCheckoutElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// mode: 'payment' with the server-computed amount + currency
<Elements stripe={stripePromise} options={{ mode: "payment", amount: 19900, currency: "sar" }}>
  <ExpressCheckoutElement
    onConfirm={async (event) => {
      // 1) create a PaymentIntent server-side (reuse create-session, method:'apple_pay')
      // 2) confirm:
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: `${SITE}/checkout/success` },
      });
    }}
  />
</Elements>
```

### Where it plugs into our page

`src/app/checkout/page.tsx` already has:
- a feature-detected Apple Pay slot at the top of the form (the black ` Pay`
  button), and
- a handler `startElectronicPayment("apple_pay")` that POSTs to
  `create-session`.

Replace that placeholder button with the real `ExpressCheckoutElement` (or keep
the custom button and call `paymentRequest` — but the Express Checkout Element is
the current recommended approach). Server side, `method:"apple_pay"` creates a
PaymentIntent exactly like `card` (see `stripe.md`).

## Step 3 — Confirmation

Apple Pay resolves to a normal Stripe PaymentIntent, so the **same webhook**
(`payment_intent.succeeded`) creates the order. No separate reconciliation.

## Native (only if you ever go outside Stripe)

If you must use Apple Pay JS directly (not recommended here), you would need:
an Apple Developer account, a **Merchant ID**, a **Payment Processing
Certificate**, a **Merchant Identity Certificate**, and to host
`/.well-known/apple-developer-merchantid-domain-association` on the domain, then
implement `onvalidatemerchant` server-side. Avoid this unless required — Stripe
removes all of it.

## Checklist

- [ ] Domain(s) registered via `/v1/payment_method_domains`
- [ ] Express Checkout Element mounted; button only shows when supported
- [ ] `method:"apple_pay"` creates a PaymentIntent (minor units, server total)
- [ ] `return_url` → `/checkout/success`
- [ ] Order created by the shared Stripe webhook (idempotent)
- [ ] Tested on a real iPhone in Safari with a Wallet card
