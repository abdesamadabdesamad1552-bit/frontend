import { Router, type Request, type Response } from "express";
import { getPool } from "../db.js";

export const orderRoutes = Router();

interface OrderBody {
  name: string;
  phone: string;
  country: string;
  items: { productId: number; quantity: number; isUpsell?: boolean }[];
  total: number;
  currency: string;
}

function generateOrderId(): string {
  return `NQ-${Date.now().toString(36).toUpperCase()}`;
}

orderRoutes.post("/", async (req: Request, res: Response) => {
  const body = req.body as OrderBody;

  if (!body.name || !body.phone || !body.items?.length) {
    res.status(400).json({ error: "Missing required fields: name, phone, items" });
    return;
  }

  const orderId = generateOrderId();

  try {
    const db = getPool();
    await db.query(
      `INSERT INTO orders (order_id, name, phone, country, items, total, currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        orderId,
        body.name.trim(),
        body.phone.trim(),
        body.country,
        JSON.stringify(body.items),
        body.total,
        body.currency,
      ]
    );
  } catch (err) {
    console.error("Database save failed:", err);
    res.status(503).json({ error: "Could not save order. Database unavailable." });
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
          orderId,
          name: body.name,
          phone: body.phone,
          country: body.country,
          items: body.items
            .map((i) => `#${i.productId} x${i.quantity}${i.isUpsell ? " (upsell)" : ""}`)
            .join(", "),
          total: `${body.total} ${body.currency}`,
        }),
      });
    } catch (err) {
      console.error("Webhook failed:", err);
    }
  }

  res.json({
    success: true,
    orderId,
    message: "Order received",
  });
});
