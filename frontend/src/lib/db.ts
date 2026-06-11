import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let schemaReady = false;

function poolSsl(connectionString: string): false | { rejectUnauthorized: boolean } {
  if (connectionString.includes("sslmode=disable")) return false;

  try {
    const host = new URL(connectionString.replace(/^postgresql:/, "http:")).hostname;
    if (
      host === "database" ||
      host === "naqabeauty_database" ||
      host.endsWith("_database") ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".internal")
    ) {
      return false;
    }
  } catch {
    // fall through
  }

  return false;
}

export function getPool(): pg.Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: url,
      ssl: poolSsl(url),
    });
  }

  return pool;
}

async function ensureSchema(): Promise<void> {
  if (schemaReady) return;

  const db = getPool();

  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(32) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      country VARCHAR(10) NOT NULL,
      total NUMERIC(10, 2) NOT NULL,
      currency VARCHAR(10) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(32) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      is_upsell BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS tracking_events (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(32) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
      event VARCHAR(100) NOT NULL,
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  schemaReady = true;
}

export interface OrderInput {
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

export async function saveOrder(body: OrderInput): Promise<{ orderId: string }> {
  if (!body.name?.trim() || !body.phone?.trim() || !body.items?.length) {
    throw new Error("Missing required fields: name, phone, items");
  }

  await ensureSchema();

  const orderId = generateOrderId();
  const db = getPool();
  const client = await db.connect();

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

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  try {
    await db.query(
      `INSERT INTO tracking_events (order_id, event, metadata)
       VALUES ($1, 'order_created', $2)`,
      [orderId, JSON.stringify({ source: "website", country: body.country })]
    );
  } catch {
    // non-fatal
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
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
    }).catch(() => {});
  }

  return { orderId };
}
