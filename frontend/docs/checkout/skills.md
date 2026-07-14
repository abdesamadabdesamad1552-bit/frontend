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

## Build order (recommended)

1. `src/lib/payments/amount.ts` — `toMinorUnits(currency, major)`.
2. Server total recompute helper — derive the authoritative total from the cart
   (reuse `calculateCartTotal` + `getCodFee`) and compare to the client `amount`.
3. **COD** already works — verify it end-to-end first (it's your reference).
4. **Stripe card** (`stripe.md`) → PaymentIntent + Payment Element + webhook.
5. **Apple Pay** (`apple-pay.md`) → domain registration + Express Checkout
   Element (reuses the Stripe webhook).
6. **Tabby** (`tabby.md`) → session → `web_url` → verify + capture + webhook.
7. **Tamara** (`tamara.md`) → session → `checkout_url` → authorise + webhook.
8. Return routes: `/checkout/success|cancel|failure` (can reuse `/thank-you`).

## The endpoint you must complete

`src/app/api/payments/create-session/route.ts` (currently returns 501). Turn it
into:

```ts
switch (method) {
  case "card":
  case "apple_pay": return createStripeIntent(...);   // { clientSecret }
  case "tabby":     return createTabbySession(...);    // { web_url }
  case "tamara":    return createTamaraSession(...);   // { checkout_url }
}
```

The checkout page already reads `redirectUrl | web_url | checkout_url` and
redirects, or mounts the Stripe Element when `clientSecret` is returned.

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
