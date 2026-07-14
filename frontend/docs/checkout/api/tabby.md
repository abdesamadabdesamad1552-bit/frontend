# Tabby — Buy Now, Pay Later (Split in 4)

**Source:** https://docs.tabby.ai/api-reference/checkout/create-a-session ·
https://docs.tabby.ai/introduction/technical-requirements

## Model

1. Server creates a **checkout session** (`POST /api/v2/checkout`).
2. Tabby pre-scores the buyer and returns a session with, when approved, a
   hosted **`web_url`**.
3. You redirect the customer to `web_url`; they complete the plan on Tabby.
4. Tabby redirects back to your `merchant_urls` (success/cancel/failure).
5. You **capture** the payment and create the order on the webhook / verified
   return.

## Base URLs & auth

| Env | Base URL |
|-----|----------|
| Production **KSA** | `https://api.tabby.sa` |
| Production UAE/KW | `https://api.tabby.ai` |
| Path | `POST /api/v2/checkout` |

Auth header: `Authorization: Bearer <TABBY_SECRET_KEY>`.
Get keys in the **Tabby Merchant Dashboard → Stores → Integration**.
`merchant_code` is your store code (e.g. `NAQASA`).

## Create a session (server)

```ts
const res = await fetch("https://api.tabby.sa/api/v2/checkout", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.TABBY_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    merchant_code: process.env.TABBY_MERCHANT_CODE,
    lang: "ar",
    merchant_urls: {
      success: `${SITE}/checkout/success?gw=tabby`,
      cancel:  `${SITE}/checkout/cancel?gw=tabby`,
      failure: `${SITE}/checkout/failure?gw=tabby`,
    },
    payment: {
      amount: "199.00",          // MAJOR units, string, 2 decimals for SAR
      currency: "SAR",           // "SAR" | "AED" | "KWD"
      description: "طلب نقاء",
      buyer: { name, email, phone, dob: null },
      shipping_address: { city, address, zip: "" },
      order: {
        reference_id: orderRef,
        items: items.map(i => ({
          title: i.name, quantity: i.quantity,
          unit_price: String(i.price), category: "beauty",
          reference_id: String(i.productId),
        })),
        tax_amount: "0.00",
        shipping_amount: "0.00",
      },
      buyer_history: { registered_since: new Date().toISOString(), loyalty_level: 0 },
      order_history: [],
    },
  }),
});
const session = await res.json();
```

## Handle the response

```ts
if (session.status === "created") {
  const url = session.configuration.available_products.installments?.[0]?.web_url;
  if (url) return Response.json({ web_url: url });   // page redirects here
}
// status "rejected" → tell the user Tabby isn't available for this order,
// fall back to another method. Show session.configuration.products... reason.
```

Response shape (trimmed):

```json
{
  "id": "<session-uuid>",
  "status": "created",
  "payment": { "id": "<payment-id>", "amount": "199.00", "currency": "SAR" },
  "configuration": {
    "available_products": { "installments": [{ "web_url": "https://checkout.tabby.ai/..." }] }
  }
}
```

## Capture + order creation

Tabby payments go `CREATED → AUTHORIZED → CLOSED`. After the buyer approves and
returns via the `success` URL:

1. **Verify** by retrieving the payment: `GET /api/v2/payments/{payment_id}`
   (Bearer secret) and check `status === "AUTHORIZED"`.
2. **Capture** it: `POST /api/v2/payments/{payment_id}/captures` with the amount.
3. Only then `saveOrder(... method:"tabby", payment_status:"paid")` (idempotent
   on `payment.id`).

Also implement the **webhook** (register its URL in the dashboard) as the
authoritative signal in case the buyer closes the tab after paying.

## Amounts / currency

- Tabby uses **major-unit decimal strings**: `"199.00"` for SAR/AED, `"19.000"`
  for KWD (3 decimals). Match ISO-4217 decimals.
- Recompute the amount server-side from the cart — never from the client.

## On-brand promo widget (optional, storefront)

Tabby offers a "Split in 4" promo snippet for the product/cart page. If you add
it, wrap it so it inherits neutral/gold styling per `design-rules.md`.

## Checklist

- [ ] `TABBY_SECRET_KEY`, `TABBY_MERCHANT_CODE` set; correct base URL for KSA
- [ ] `create-session` (method `tabby`) returns `web_url`
- [ ] `rejected` handled with a graceful fallback message
- [ ] success/cancel/failure return routes exist
- [ ] Verify + capture + idempotent order creation
- [ ] Webhook registered and verified
