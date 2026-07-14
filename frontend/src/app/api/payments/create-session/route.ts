/**
 * Payment gateway session bootstrap.
 *
 * Single entry point the checkout page calls for every electronic payment
 * method (Stripe card / Apple Pay / Tabby / Tamara). Cash on Delivery does
 * NOT go through here — it uses the existing /api/orders flow directly,
 * since COD finalizes on submission (payment happens at the door).
 *
 * Flow for every electronic method:
 *   1. Validate input + recompute the total server-side (never trust the client amount).
 *   2. Create a *pending* order row (see src/lib/db.ts createPendingOrder).
 *   3. Create the provider session/intent, store its id on the order.
 *   4. Return whatever the checkout page needs to continue:
 *        card / apple_pay -> { clientSecret, orderId }
 *        tabby            -> { web_url, orderId }
 *        tamara           -> { checkout_url, orderId }
 *   5. The order is only marked "paid" later, by the provider's webhook —
 *      see src/app/api/payments/{stripe,tabby,tamara}/webhook/route.ts.
 *
 * Docs: frontend/docs/checkout/api/{stripe,apple-pay,tabby,tamara}.md
 */

import type { CartItem } from "@/lib/cart-context";
import { createPendingOrder, setOrderPaymentReference } from "@/lib/db";
import { toMinorUnits } from "@/lib/payments/amount";
import { assertAmountMatches, recomputeServerTotal } from "@/lib/payments/server-total";
import { getStripeClient, isStripeConfigured } from "@/lib/payments/stripe";
import { createTabbySession, isTabbyConfigured } from "@/lib/payments/tabby";
import { createTamaraSession, isTamaraConfigured } from "@/lib/payments/tamara";
import { countries, normalizePhone, validatePhone, type CountryCode } from "@/lib/pricing";

type Method = "card" | "apple_pay" | "tabby" | "tamara";

interface CustomerInput {
  name?: string;
  phone?: string;
  city?: string;
  address?: string;
  email?: string;
}

interface CreateSessionBody {
  method: Method;
  items: CartItem[];
  country: CountryCode;
  amount?: number;
  currency: string;
  customer: CustomerInput;
}

const DOCS: Record<Method, string> = {
  card: "docs/checkout/api/stripe.md",
  apple_pay: "docs/checkout/api/apple-pay.md",
  tabby: "docs/checkout/api/tabby.md",
  tamara: "docs/checkout/api/tamara.md",
};

function notConfigured(method: Method) {
  return Response.json(
    {
      error: "gateway_not_configured",
      method,
      message: "بوابة الدفع الإلكتروني قيد التفعيل. الدفع عند الاستلام متاح الآن.",
      implementIn: "src/app/api/payments/create-session/route.ts",
      docs: DOCS[method],
    },
    { status: 501 }
  );
}

export async function POST(request: Request) {
  let body: CreateSessionBody;
  try {
    body = (await request.json()) as CreateSessionBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { method, items, country, currency, customer } = body;

  if (!method || !(method in DOCS)) {
    return Response.json({ error: "Unknown payment method" }, { status: 400 });
  }
  if (!country || !(country in countries)) {
    return Response.json({ error: "Invalid country" }, { status: 400 });
  }
  if (!items?.length) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (
    !customer?.name?.trim() ||
    !customer?.phone?.trim() ||
    !customer?.city?.trim() ||
    !customer?.address?.trim()
  ) {
    return Response.json({ error: "Missing customer details" }, { status: 400 });
  }
  if (!validatePhone(customer.phone, country)) {
    return Response.json({ error: "Invalid phone number" }, { status: 400 });
  }

  let serverTotal: number;
  try {
    serverTotal = recomputeServerTotal({ items, country, method });
    assertAmountMatches(body.amount, serverTotal);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Invalid amount" },
      { status: 400 }
    );
  }

  const phone = normalizePhone(customer.phone, country);
  const name = customer.name.trim();
  const city = customer.city.trim();
  const address = customer.address.trim();

  // ── Stripe (card + Apple Pay share one PaymentIntent flow) ──────────────
  if (method === "card" || method === "apple_pay") {
    if (!isStripeConfigured()) return notConfigured(method);

    try {
      const { orderId } = await createPendingOrder({
        name,
        phone,
        country,
        items,
        total: serverTotal,
        currency,
        city,
        address,
        paymentMethod: method,
      });

      const stripe = getStripeClient();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: toMinorUnits(currency, serverTotal),
        currency: currency.toLowerCase(),
        automatic_payment_methods: { enabled: true },
        metadata: { order_id: orderId, method },
      });

      await setOrderPaymentReference(orderId, paymentIntent.id);

      return Response.json({ clientSecret: paymentIntent.client_secret, orderId });
    } catch (err) {
      console.error("[payments] Stripe session failed:", err);
      return Response.json(
        { error: "تعذر إنشاء جلسة الدفع. يرجى المحاولة مرة أخرى." },
        { status: 502 }
      );
    }
  }

  // ── Tabby ─────────────────────────────────────────────────────────────
  if (method === "tabby") {
    if (!isTabbyConfigured()) return notConfigured(method);

    try {
      const { orderId } = await createPendingOrder({
        name,
        phone,
        country,
        items,
        total: serverTotal,
        currency,
        city,
        address,
        paymentMethod: "tabby",
      });

      const session = await createTabbySession({
        orderId,
        amount: serverTotal,
        currency,
        country,
        items,
        customer: { name, phone, email: customer.email, city, address },
      });

      await setOrderPaymentReference(orderId, session.tabbySessionId);

      if (session.status === "rejected" || !session.webUrl) {
        return Response.json(
          {
            error: "tabby_rejected",
            message: "عذراً، تابي غير متاح لهذا الطلب. جرّبي طريقة دفع أخرى.",
            orderId,
          },
          { status: 422 }
        );
      }

      return Response.json({ web_url: session.webUrl, orderId });
    } catch (err) {
      console.error("[payments] Tabby session failed:", err);
      return Response.json(
        { error: "تعذر إنشاء جلسة تابي. يرجى المحاولة مرة أخرى." },
        { status: 502 }
      );
    }
  }

  // ── Tamara ────────────────────────────────────────────────────────────
  if (method === "tamara") {
    if (!isTamaraConfigured()) return notConfigured(method);

    try {
      const { orderId } = await createPendingOrder({
        name,
        phone,
        country,
        items,
        total: serverTotal,
        currency,
        city,
        address,
        paymentMethod: "tamara",
      });

      const session = await createTamaraSession({
        orderId,
        amount: serverTotal,
        currency,
        country,
        items,
        customer: { name, phone, email: customer.email, city, address },
      });

      await setOrderPaymentReference(orderId, session.tamaraOrderId);

      return Response.json({ checkout_url: session.checkoutUrl, orderId });
    } catch (err) {
      console.error("[payments] Tamara session failed:", err);
      return Response.json(
        { error: "تعذر إنشاء جلسة تمارا. يرجى المحاولة مرة أخرى." },
        { status: 502 }
      );
    }
  }

  return Response.json({ error: "Unhandled method" }, { status: 400 });
}
