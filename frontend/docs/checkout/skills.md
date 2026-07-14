# Skills & Acceptance Checklist — everything the coder needs

## Required skills

- **Next.js 15 App Router**: Route Handlers, server vs client components, `fetch`
  in server code, dynamic vs static rendering.
- **TypeScript (strict)** + **React 19** (hooks, controlled forms).
- **Tailwind CSS v4** with the project's design tokens (`design-rules.md`).
- **Payments**: Stripe PaymentIntents / Payment Element / Express Checkout,
  webhook signature verification; BNPL redirect flows (Tabby, Tamara);
  Apple Pay domain registration via Stripe.
- **Postgres / `pg`**: transactions, `CREATE TABLE IF NOT EXISTS` migrations,
  idempotent writes.
- **Security**: secret management, webhook verification, idempotency,
  server-side amount recomputation, PII handling.
- **i18n/RTL Arabic**: keep copy Arabic, layout RTL, currency per GCC country.
- **Money math**: ISO-4217 minor units (2 vs 3 decimals), never float the charge.

## Status: implemented, needs real credentials + live testing

All of the below is already coded (see `README.md` for the full file map).
There is nothing left to build from scratch — your job is to:

1. Get real Stripe / Tabby / Tamara accounts and sandbox keys.
2. Drop them into `.env.local` (dev) / EasyPanel (prod) per `.env.example`.
3. Test each flow for real (see the test matrix below) and fix anything a live
   payload reveals — in particular, the Tabby and Tamara webhook handlers
   (`src/app/api/payments/{tabby,tamara}/webhook/route.ts`) have a comment
   flagging the exact field names as "our best documented understanding,
   verify against a live delivery" — adjust those interfaces if a real
   webhook payload differs.
4. Register each provider's webhook URL in its dashboard, and register your
   domain with Stripe for Apple Pay (one `curl` call — see `apple-pay.md`).

## The endpoint (already implemented)

`src/app/api/payments/create-session/route.ts` validates the request,
recomputes the total server-side, creates a pending order, then:

```ts
switch (method) {
  case "card":
  case "apple_pay": // -> Stripe PaymentIntent, returns { clientSecret, orderId }
  case "tabby":      // -> Tabby session,        returns { web_url, orderId }
  case "tamara":     // -> Tamara session,        returns { checkout_url, orderId }
}
```

Each branch returns **501 `gateway_not_configured`** if that provider's env
vars aren't set yet — the checkout page already shows the right fallback
message in that case, so you can deploy incrementally (e.g. ship Tabby before
Stripe is ready).

## Data the page already sends to `create-session`

```json
{
  "method": "card | apple_pay | tabby | tamara",
  "items": [{ "productId": 1, "quantity": 2 }],
  "country": "SA",
  "amount": 199,
  "currency": "SAR",
  "customer": { "name": "…", "phone": "05…", "city": "…", "address": "…" }
}
```

## Acceptance criteria (definition of done)

- [ ] Selecting **card** and paying with a Stripe test card creates a **paid**
      order and lands on the thank-you/success page.
- [ ] **Apple Pay** button shows on a real iPhone/Safari, completes, creates the
      order via the same Stripe webhook.
- [ ] **Tabby** redirects to its hosted page, returns, and the order is created
      only after capture; `rejected` falls back gracefully.
- [ ] **Tamara** redirects, returns, order created only after authorise.
- [ ] **COD** still works and adds the **30 SAR** (local-equiv) fee to the total.
- [ ] Every gateway total is **recomputed server-side** in correct minor/major
      units; tampering with the client amount is rejected.
- [ ] All webhooks **verify signatures** and are **idempotent** (no double orders).
- [ ] `npx tsc --noEmit` and `npx eslint .` are clean; `npm run build` passes.
- [ ] No secret key is exposed to the client; only `NEXT_PUBLIC_*` in the browser.
- [ ] Design unchanged — matches `design-rules.md` (black/white/gold, pills,
      soft shadows), fully responsive and RTL.

## Manual test matrix

| Method | Sandbox | Success | Cancel/Reject | Order created once |
|--------|---------|---------|---------------|--------------------|
| COD | n/a | ✅ | n/a | ✅ |
| Card (Stripe) | test keys | 4242… | 4000…0002 | ✅ webhook |
| Apple Pay | test keys | real device | user cancels | ✅ webhook |
| Tabby | sandbox | approved buyer | rejected buyer | ✅ capture |
| Tamara | sandbox | approved | cancelled | ✅ authorise |

## Env vars — see `coding-rules.md` (set all in EasyPanel before go-live).
