/**
 * Payment gateway session bootstrap — STUB.
 *
 * This endpoint is the single entry point the checkout page calls for the
 * electronic payment methods (Stripe card / Apple Pay / Tabby / Tamara).
 * It intentionally returns 501 until the gateways are wired up with real
 * merchant keys. The AI coder implements each provider here following the
 * integration docs in `frontend/docs/checkout/`:
 *
 *   - Stripe / Apple Pay → docs/checkout/api/stripe.md, api/apple-pay.md
 *   - Tabby             → docs/checkout/api/tabby.md
 *   - Tamara            → docs/checkout/api/tamara.md
 *
 * Expected final behavior per method:
 *   - card / apple_pay → create a Stripe PaymentIntent, return client_secret
 *   - tabby            → create a Tabby checkout session, return web_url
 *   - tamara           → create a Tamara checkout session, return checkout_url
 */

type Method = "card" | "apple_pay" | "tabby" | "tamara";

interface CreateSessionBody {
  method: Method;
  // cart + customer are forwarded so the coder has everything server-side.
  items?: { productId: number; quantity: number }[];
  country?: string;
  amount?: number;
  currency?: string;
  customer?: { name?: string; phone?: string; city?: string; address?: string };
}

const DOCS: Record<Method, string> = {
  card: "docs/checkout/api/stripe.md",
  apple_pay: "docs/checkout/api/apple-pay.md",
  tabby: "docs/checkout/api/tabby.md",
  tamara: "docs/checkout/api/tamara.md",
};

export async function POST(request: Request) {
  let body: CreateSessionBody;
  try {
    body = (await request.json()) as CreateSessionBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const method = body.method;
  if (!method || !(method in DOCS)) {
    return Response.json({ error: "Unknown payment method" }, { status: 400 });
  }

  return Response.json(
    {
      error: "gateway_not_configured",
      method,
      message:
        "بوابة الدفع الإلكتروني قيد التفعيل. الدفع عند الاستلام متاح الآن.",
      implementIn: "src/app/api/payments/create-session/route.ts",
      docs: DOCS[method],
    },
    { status: 501 }
  );
}
