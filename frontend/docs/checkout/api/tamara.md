# Tamara — Buy Now, Pay Later (Pay later / Split)

**Source:** https://docs.tamara.co/reference/createcheckoutsession ·
https://docs.tamara.co/docs/direct-online-checkout

## Model

1. Server creates a **checkout session** (`POST /checkout`) with the full order.
2. Tamara returns `order_id`, `checkout_id`, `status`, and a hosted
   **`checkout_url`**.
3. Redirect the customer to `checkout_url`; they approve financing on Tamara.
4. Tamara redirects back to your `merchant_url` success/failure/cancel and calls
   your `notification` (webhook) URL.
5. **Authorise** the order, then create it on the verified notification.

## Base URLs & auth

| Env | Base URL |
|-----|----------|
| Sandbox | `https://api-sandbox.tamara.co` |
| Production | `https://api.tamara.co` |
| Path | `POST /checkout` |

Auth header: `Authorization: Bearer <TAMARA_API_TOKEN>`.
Tamara gives you sandbox credentials after merchant sign-up (needs a corporate
Saudi bank account). Country codes: `SA, AE, BH, KW, OM`.

## Create a checkout session (server)

```ts
const res = await fetch("https://api.tamara.co/checkout", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.TAMARA_API_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    order_reference_id: orderRef,
    total_amount:    { amount: 199.0, currency: "SAR" }, // MAJOR units (number)
    shipping_amount: { amount: 0,     currency: "SAR" },
    tax_amount:      { amount: 0,     currency: "SAR" },
    locale: "ar_SA",
    is_mobile: false,
    payment_type: "PAY_BY_LATER",     // or "PAY_BY_INSTALMENTS"
    instalments: null,                // e.g. 3 for split
    consumer: { first_name: name, last_name: "", phone_number: phone, email, country_code: "SA" },
    shipping_address: {
      first_name: name, last_name: "", line1: address,
      city, country_code: "SA", phone_number: phone,
    },
    items: items.map(i => ({
      name: i.name, type: "Beauty", reference_id: String(i.productId),
      sku: i.sku, quantity: i.quantity,
      unit_price:  { amount: i.price, currency: "SAR" },
      total_amount:{ amount: i.price * i.quantity, currency: "SAR" },
    })),
    merchant_url: {
      success:      `${SITE}/checkout/success?gw=tamara`,
      failure:      `${SITE}/checkout/failure?gw=tamara`,
      cancel:       `${SITE}/checkout/cancel?gw=tamara`,
      notification: `${SITE}/api/payments/tamara/webhook`,
    },
    expires_in_minutes: 30,
  }),
});
const data = await res.json();
return Response.json({ checkout_url: data.checkout_url }); // page redirects here
```

Response (200):

```json
{
  "order_id": "<uuid>",
  "checkout_id": "<uuid>",
  "checkout_url": "https://checkout.tamara.co/...",
  "status": "new"
}
```

## Authorise + order creation

Tamara order lifecycle: `new → approved → authorised → captured`.

1. On the **notification** webhook (`order_id`, `order_status`) verify with the
   `TAMARA_NOTIFICATION_TOKEN`, then
2. `POST /orders/{order_id}/authorise` to authorise, then optionally capture.
3. Create the order (`saveOrder(... method:"tamara")`), idempotent on `order_id`.

Always re-fetch `GET /merchants/orders/{order_id}` to confirm status before
trusting a redirect.

## Amounts / currency

- Tamara amounts are **`{ amount, currency }` objects in MAJOR units** (numbers),
  not minor units. `199.0` SAR, `19.0` OMR, etc.
- Recompute server-side from the cart. Item totals must sum to `total_amount`
  minus shipping/tax as Tamara validates the breakdown.

## Eligibility widget (optional, storefront)

Tamara has a product/cart "pay later" widget and an availability check
(`/checkout/payment-types`) you can call to hide Tamara when the order is out of
its min/max limits. Recommended so users don't pick an ineligible method.

## Checklist

- [ ] `TAMARA_API_TOKEN`, `TAMARA_NOTIFICATION_TOKEN` set; correct base URL
- [ ] `create-session` (method `tamara`) returns `checkout_url`
- [ ] Amounts as `{amount,currency}` major units; breakdown sums correctly
- [ ] success/failure/cancel + notification routes exist
- [ ] Webhook verified, then authorise + idempotent order creation
- [ ] (Optional) eligibility check hides Tamara when out of limits
