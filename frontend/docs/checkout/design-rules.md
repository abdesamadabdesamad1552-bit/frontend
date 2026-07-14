# Design Rules — Checkout

Match the existing luxury design system exactly. Do **not** invent new colors,
fonts, or radii. The checkout page is intentionally calmer than the store.

## Color tokens (from `src/app/globals.css`)

| Token | Value | Use |
|-------|-------|-----|
| `brand-black` | `#111111` | Text, primary buttons |
| `brand-gold` | `#C8A24A` | Accents only (icons, rings, dividers, ratings) |
| `brand-gold-dark` | `#A07F2E` | Gold text on light bg (contrast-safe) |
| `brand-beige` | `#F8F8F6` | Page / section background |
| `brand-beige-dark` | `#E8E8E8` | Borders |
| `brand-white` | `#FFFFFF` | Cards |
| `brand-gray` | `#6B6B6B` | Secondary text |

**Ratio:** ~80% white/neutral, ~15% black, ~5% gold. Gold is a garnish, never a
fill for large areas. No blue/red/green/purple/orange except red for form-error
text only.

## Typography

- Body: `IBM Plex Sans Arabic` (default).
- Display headings: `font-display` (Reem Kufi) — used sparingly.
- Logo lockup: `font-logo-ar` (نقاء) + `font-logo-latin` (NAQA BEAUTY).

## Components / patterns

- **Buttons:** primary = `bg-brand-black text-brand-white rounded-full`, hover
  `hover:bg-brand-gold`, `active:scale-[0.98]`, `transition-all duration-300`.
- **Cards:** `bg-brand-white rounded-2xl border border-brand-beige-dark
  shadow-[var(--shadow-luxe)]`. Hover lift only on interactive cards.
- **Inputs:** `rounded-xl border border-brand-beige-dark`, focus =
  `focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/15`.
- **Radius:** pills for CTAs (`rounded-full`), `rounded-2xl` cards, `rounded-xl`
  inputs / inner blocks.
- **Shadows:** only `--shadow-luxe` / `--shadow-luxe-lg`. No hard drop shadows.
- **Motion:** fade / slide / scale / opacity only, 300–500ms, soft easing.
  Respect `prefers-reduced-motion` (already handled globally).

## Checkout-specific rules

- **Simplified header:** logo + a small “دفع آمن ومشفّر” lock line. No nav, no
  cart icon, no country picker — reduce exits (this is a conversion page).
- **Two columns on desktop** (`lg`): form left, **sticky** order summary right.
  Single column on mobile with the summary first, CTA after.
- **Payment method selector:** radio cards; selected = gold border + gold ring +
  faint beige fill. Keep provider names in their own casing (`tabby`, `tamara`,
  `mada`, `VISA`, `Mastercard`) as small neutral tag pills.
- **Apple Pay express button:** black pill with ` Pay`, shown **only** when
  `window.ApplePaySession?.canMakePayments()` is true. Put it above the form
  with an “أو أكملي بالبيانات” divider.
- **COD fee** must be shown as a line item in the summary and as a `+30 ر.س
  رسوم` pill on the COD option; the grand total updates live when COD is chosen.
- **Trust / CRO block** under the summary: secure-payment, free shipping, easy
  returns, authentic products, 4.9/5 rating. Keep icons gold, text neutral.
- **Provider widgets** (Tabby/Tamara "pay in 4" promo snippets) should use the
  provider's official web component and inherit these neutral colors — don't let
  their default bright brand colors dominate; wrap them to stay on-brand.

## Accessibility

- Every input has a `<label htmlFor>`; errors are text (not color-only).
- Keyboard focus uses the global gold `:focus-visible` ring.
- Radio group is a real `<input type="radio">` inside a `<label>` (already done).
- Buttons have `aria-label` when icon-only (e.g. Apple Pay).
