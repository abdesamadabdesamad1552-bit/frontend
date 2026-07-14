# Coding Rules — Checkout & Payments

## Stack

- **Next.js 15 (App Router)** + **React 19** + **TypeScript** (strict).
- **Tailwind CSS v4** (tokens in `src/app/globals.css`).
- Server logic in **Route Handlers** (`src/app/api/**/route.ts`) — Node runtime.
- DB: **Postgres** via `pg` (`src/lib/db.ts`). Orders table already exists.
- Deploy: **EasyPanel** (standalone Next output). Env vars set in the panel.

## Project conventions

- Reuse existing helpers — do **not** duplicate:
  - Pricing / currency / phone: `src/lib/pricing.ts`
  - Cart types + state: `src/lib/cart-context.tsx`
  - COD order creation: `src/lib/checkout-flow.ts` + `src/app/api/orders/route.ts`
  - Order persistence: `src/lib/db.ts` (`saveOrder`, `ensureSchema`)
  - Post-order UX: `src/lib/order-snapshot.ts`, `src/lib/order-redirect.ts`
- Arabic UI is **RTL** (`dir="rtl"` on `<html>`). Keep all copy in Arabic.
- Files: kebab or PascalCase components; named exports for libs.
- Run before commit: `npx tsc --noEmit` and `npx eslint .` — both must be clean.
  `next.config.ts` has `eslint.ignoreDuringBuilds: false`, so lint errors fail the build.

## Money & currency (critical)

- **Recompute totals server-side.** The client sends an `amount`, but you must
  re-derive it from the cart + `calculateCartTotal()` / `getCodFee()` and reject
  mismatches. The client value is a hint, not a source of truth.
- Gateways expect **minor units** (the smallest currency unit):
  - SAR, AED, QAR → 2 decimals → multiply by **100** (e.g. 199 SAR → `19900`).
  - KWD, BHD, OMR → 3 decimals → multiply by **1000**.
  - Tabby/Tamara take **major-unit decimal strings** (e.g. `"199.00"`), Stripe
    takes **integer minor units** (e.g. `19900`). Read each provider doc.
- Never do floating-point money math for the charge — build minor units with
  integer arithmetic.

## Security

- **Secret keys are server-only.** Only `NEXT_PUBLIC_*` values reach the browser
  (e.g. Stripe publishable key). Everything else stays in Route Handlers.
- **Verify webhooks.** Stripe: verify the `Stripe-Signature` header with the
  webhook secret. Tabby/Tamara: verify the signature/secret they send and/or
  re-fetch the order from their API before trusting a status.
- **Idempotency.** A webhook can fire more than once. Key order creation by the
  gateway payment/session id so you never double-create an order.
- **Create the order only after payment success** — on webhook `authorized`/
  `approved`/`succeeded`, or on a verified return. Redirect back ≠ paid.
- Validate & normalize the phone with `validatePhone` / `normalizePhone` before
  saving (already done on the page, re-check server-side).

## Environment variables (add to EasyPanel)

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Tabby
TABBY_SECRET_KEY=sk_...
TABBY_PUBLIC_KEY=pk_...
TABBY_MERCHANT_CODE=your_store_code   # e.g. "NAQASA"

# Tamara
TAMARA_API_TOKEN=...                   # merchant API token
TAMARA_NOTIFICATION_TOKEN=...          # to verify webhook
TAMARA_PUBLIC_KEY=...                  # for the widget (optional)

# Shared
NEXT_PUBLIC_SITE_URL=https://naqabeauty.store
```

## Suggested server structure

```
src/app/api/payments/
  create-session/route.ts     # switch(method) → provider create-session (EXISTS as stub)
  stripe/webhook/route.ts     # verify signature, on success → saveOrder
  tabby/webhook/route.ts
  tamara/webhook/route.ts
src/app/checkout/
  success/page.tsx            # verify + show thank-you (or reuse /thank-you)
  cancel/page.tsx
  failure/page.tsx
src/lib/payments/
  stripe.ts                   # server SDK wrapper
  tabby.ts
  tamara.ts
  amount.ts                   # toMinorUnits(country, amount) helper
```

## Order creation contract

Reuse `saveOrder(body: OrderInput)` from `src/lib/db.ts`. It already writes the
`orders` + `order_items` tables and syncs the Google Sheet. Extend `OrderInput`
if you need to store `city`, `address`, `payment_method`, and `payment_status`
(add columns via `ensureSchema()` — it is `CREATE TABLE IF NOT EXISTS` safe).
