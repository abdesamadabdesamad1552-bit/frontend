import { getOrderPaymentStatus } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");

  if (!orderId) {
    return Response.json({ error: "orderId is required" }, { status: 400 });
  }

  try {
    const status = await getOrderPaymentStatus(orderId);
    if (!status) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
    return Response.json(status);
  } catch (err) {
    console.error("[payments/status] lookup failed:", err);
    return Response.json({ error: "Status temporarily unavailable" }, { status: 503 });
  }
}
