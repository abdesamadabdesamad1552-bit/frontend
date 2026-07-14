# Naqa Beauty — Checkout & Payments Integration Docs

> Everything an AI coder needs to turn the `/checkout` page from a working
> Cash-on-Delivery (COD) checkout into a full multi-gateway checkout
> (Stripe card + Apple Pay, Tabby, Tamara), for the GCC market (KSA-first).

## What already exists (done)

| Piece | Location | Status |
|-------|----------|--------|
| Checkout page UI | `src/app/checkout/page.tsx` | ✅ Built (simplified header, Apple Pay express slot, form, method selector, dynamic COD +30 SAR fee, trust block, simple footer, sticky summary) |
| COD order flow | `src/lib/checkout-flow.ts` → `/api/orders` → Postgres + Google Sheet | ✅ Works end-to-end |
| Gateway entry point (stub) | `src/app/api/payments/create-session/route.ts` | ⛔ Returns `501` — **you implement this** |
| COD fee helper | `src/lib/pricing.ts` → `getCodFee(country)` | ✅ 30 SAR for KSA |

The checkout page already collects everything (name, phone, city, address,
cart, amount, currency, method) and `POST`s it to
`/api/payments/create-session` for every electronic method. Your job is to make
that endpoint create a real gateway session and return a redirect/secret.

## What you implement

For each electronic method the page sends `{ method, items, country, amount,
currency, customer }`. Implement `create-session` so it returns one of:

- `{ redirectUrl }` — page will `window.location.href = redirectUrl` (Tabby / Tamara / Stripe Checkout)
- `{ web_url }` — Tabby hosted checkout
- `{ checkout_url }` — Tamara hosted checkout
- `{ clientSecret }` — Stripe Payment Element (if you switch to an on-page Element instead of redirect)

Then implement the **webhook** + **success/cancel/failure** return routes so the
order is created only after the gateway confirms payment.

## Read these in order

1. [`coding-rules.md`](./coding-rules.md) — conventions, security, money handling, env vars
2. [`design-rules.md`](./design-rules.md) — the luxury design system to match
3. [`api/stripe.md`](./api/stripe.md) — card payments (PaymentIntent / Payment Element)
4. [`api/apple-pay.md`](./api/apple-pay.md) — Apple Pay (via Stripe — recommended)
5. [`api/tabby.md`](./api/tabby.md) — Tabby BNPL (KSA/UAE)
6. [`api/tamara.md`](./api/tamara.md) — Tamara BNPL (KSA)
7. [`skills.md`](./skills.md) — full skills checklist + acceptance criteria

## Golden rules (non-negotiable)

- **Never trust the client amount.** Recompute the order total server-side from
  the cart + `src/lib/pricing.ts` before creating any gateway session.
- **Create the order only after payment is confirmed** (webhook or verified
  return), never on redirect alone.
- **Keys are server-only.** Secret keys live in env vars, never in client code.
- **Currency is minor-unit sensitive.** SAR/AED use 2 decimals; KWD/BHD/OMR use 3.
- **Match the existing design system** — do not restyle the store.
