import { saveOrder } from "@/lib/db";
import { proxyToBackend } from "@/lib/backend-proxy";

export async function POST(request: Request) {
  if (process.env.DATABASE_URL) {
    try {
      const body = await request.json();

      const { orderId } = await saveOrder({
        name: body.name,
        phone: body.phone,
        country: body.country,
        items: body.items,
        total: body.total,
        currency: body.currency,
      });

      return Response.json({
        success: true,
        orderId,
        message: "Order received",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";

      if (message.includes("Missing required fields")) {
        return Response.json({ error: message }, { status: 400 });
      }

      console.error("[orders] direct DB save failed, trying backend:", message);
    }
  }

  return proxyToBackend("/api/orders", request);
}
