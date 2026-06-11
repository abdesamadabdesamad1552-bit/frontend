import { saveOrder } from "@/lib/db";

export async function POST(request: Request) {
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

    if (message.includes("DATABASE_URL")) {
      console.error("[orders] DATABASE_URL not configured on frontend service");
      return Response.json(
        { error: "Could not save order. Database unavailable." },
        { status: 503 }
      );
    }

    console.error("[orders] save failed:", message);
    return Response.json(
      { error: "Could not save order. Database unavailable." },
      { status: 503 }
    );
  }
}
