import { saveOrder, type OrderInput } from "@/lib/db";
import { proxyToBackendWithBody } from "@/lib/backend-proxy";

export async function POST(request: Request) {
  const bodyText = await request.text();

  let body: OrderInput;
  try {
    body = JSON.parse(bodyText) as OrderInput;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (process.env.DATABASE_URL) {
    try {
      const { orderId } = await saveOrder(body);
      return Response.json({
        success: true,
        orderId,
        message: "Order received",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("[orders] DB save failed:", message);

      if (message.includes("Missing required fields")) {
        return Response.json({ error: message }, { status: 400 });
      }

      return Response.json(
        { error: "تعذر حفظ الطلب. يرجى المحاولة بعد قليل." },
        { status: 503 }
      );
    }
  }

  return proxyToBackendWithBody("/api/orders", "POST", bodyText);
}
