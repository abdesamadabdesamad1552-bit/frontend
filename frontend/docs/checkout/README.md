# Naqa Beauty — Checkout & Payments Integration Docs

> Everything an AI coder needs to turn the `/checkout` page from a working
> Cash-on-Delivery (COD) checkout into a full multi-gateway checkout
> (Stripe card + Apple Pay, Tabby, Tamara), for the GCC market (KSA-first).

## Status: code is implemented, gateways are not yet credentialed

Every piece below is coded and passes `tsc`/`eslint`/`build`, tested locally
**without real gateway credentials** (each provider gracefully falls back to
a 501 "قيد التفعيل" / COD-only state when its env vars are absent — verified).
What's left is purely operational: get real Stripe/Tabby/Tamara accounts, drop
the keys into EasyPanel, and test each flow against sandbox/test credentials
end-to-end (a real card charge, a real Apple Pay device, a real Tabby/Tamara
sandbox approval) — see the checklist in `skills.md`.

| Piece | Location | Status |
|-------|----------|--------|
| Checkout page UI | `src/app/checkout/page.tsx` | ✅ Simplified header, Apple Pay/Google Pay express button, form, method selector, dynamic COD +30 SAR fee, trust block, simple footer, sticky summary |
| COD order flow | `src/lib/checkout-flow.ts` → `/api/orders` → Postgres + Google Sheet | ✅ Unchanged, still works end-to-end |
| Server total recompute | `src/lib/payments/server-total.ts` | ✅ Recomputes from the cart; rejects tampered amounts |
| Minor/major unit helper | `src/lib/payments/amount.ts` | ✅ 2 vs 3 decimals per currency |
| Pending-order + idempotent confirm | `src/lib/db.ts` (`createPendingOrder`, `markOrderPaid`, `getOrderPaymentStatus`) | ✅ New `city`/`address`/`payment_method`/`payment_status`/`payment_reference` columns (auto-migrated) |
| Gateway session endpoint | `src/app/api/payments/create-session/route.ts` | ✅ Implemented for card/apple_pay/tabby/tamara — returns 501 with a docs pointer if that provider's env vars are missing |
| Stripe card + Apple Pay | `src/lib/payments/stripe.ts`, `src/components/checkout/StripePaymentSection.tsx` | ✅ PaymentIntent + Express Checkout Element (Apple/Google Pay) + Payment Element, deferred-intent pattern |
| Tabby session + capture | `src/lib/payments/tabby.ts` | ✅ Create session, fetch payment, capture |
| Tamara session + authorise | `src/lib/payments/tamara.ts` | ✅ Create session, fetch order, authorise |
| Webhooks | `src/app/api/payments/{stripe,tabby,tamara}/webhook/route.ts` | ✅ Signature/token verified, idempotent via `markOrderPaid` |
| Return pages | `src/app/checkout/{success,cancel,failure}/page.tsx` | ✅ success polls `/api/payments/status` then hands off to `/thank-you` |
| COD fee helper | `src/lib/pricing.ts` → `getCodFee(country)` | ✅ 30 SAR for KSA |

## What's left (operational, not code)

1. **Get real merchant accounts** for Stripe, Tabby, and Tamara (see each
   `api/*.md` for requirements — Tamara needs a Saudi corporate bank account).
2. **Set the env vars** from `.env.example` in EasyPanel (sandbox/test keys first).
3. **Register webhooks** in each dashboard pointing at
   `https://naqabeauty.store/api/payments/{stripe,tabby,tamara}/webhook`.
4. **Register your domain with Stripe** for Apple Pay (`api/apple-pay.md` —
   one `curl` call, no certificates needed).
5. **Test each flow for real** and adjust the two spots explicitly marked
   "verify against a live payload" in the Tabby/Tamara webhook handlers — the
   field names there are our best documented understanding, not a guarantee,
   since they were written from public docs rather than a live webhook capture.

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
