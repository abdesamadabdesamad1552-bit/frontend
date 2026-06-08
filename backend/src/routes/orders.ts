import { Router, type Request, type Response } from "express";

export const orderRoutes = Router();

interface OrderBody {
  name: string;
  phone: string;
  country: string;
  items: { productId: number; quantity: number; isUpsell?: boolean }[];
  total: number;
  currency: string;
}

orderRoutes.post("/", async (req: Request, res: Response) => {
  const body = req.body as OrderBody;

  if (!body.name || !body.phone || !body.items?.length) {
    res.status(400).json({ error: "Missing required fields: name, phone, items" });
    return;
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          name: body.name,
          phone: body.phone,
          country: body.country,
          items: body.items.map((i) => `#${i.productId} x${i.quantity}${i.isUpsell ? " (upsell)" : ""}`).join(", "),
          total: `${body.total} ${body.currency}`,
        }),
      });
    } catch (err) {
      console.error("Webhook failed:", err);
    }
  }

  res.json({
    success: true,
    orderId: `NQ-${Date.now().toString(36).toUpperCase()}`,
    message: "Order received",
  });
});
