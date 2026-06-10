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
  let client;

  try {
    const db = getPool();
    client = await db.connect();
  } catch (err) {
    console.error("Database unavailable:", err);
    res.status(503).json({ error: "Could not save order. Database unavailable." });
    return;
  }

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO orders (order_id, name, phone, country, total, currency, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
      [
        orderId,
        body.name.trim(),
        body.phone.trim(),
        body.country,
        body.total,
        body.currency,
      ]
    );

    for (const item of body.items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, is_upsell)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.productId, item.quantity, item.isUpsell ?? false]
      );
    }

    await client.query(
      `INSERT INTO tracking_events (order_id, event, metadata)
       VALUES ($1, 'order_created', $2)`,
      [orderId, JSON.stringify({ source: "website", country: body.country })]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Database save failed:", err);
    res.status(503).json({ error: "Could not save order. Database unavailable." });
    return;
  } finally {
    client.release();
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
