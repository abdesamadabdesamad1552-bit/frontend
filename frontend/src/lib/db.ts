import pg from "pg";
import { products } from "@/lib/products";
import { sendTikTokPurchaseEvent } from "@/lib/analytics/tiktok-capi";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let schemaReady = false;

/** Fix common Easypanel wrong DATABASE_URL (postgres DB / database host). */
export function normalizeDatabaseUrl(raw: string): string {
  try {
    const parsed = new URL(raw.replace(/^postgresql:/, "http:"));

    if (parsed.hostname === "database") {
      parsed.hostname = "naqabeauty_database";
    }

    const dbName = parsed.pathname.replace(/^\//, "");
    if (!dbName || dbName === "postgres") {
      parsed.pathname = "/naqabeauty";
    }

    if (
      !parsed.searchParams.has("sslmode") &&
      (parsed.hostname.endsWith("_database") || parsed.hostname === "database")
    ) {
      parsed.searchParams.set("sslmode", "disable");
    }

    const user = decodeURIComponent(parsed.username);
    const pass = decodeURIComponent(parsed.password);
    const port = parsed.port || "5432";
    const search = parsed.search ? parsed.search : "";

    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${parsed.hostname}:${port}${parsed.pathname}${search}`;
  } catch {
    return raw;
  }
}

export function getDatabaseTarget(): { host?: string; name?: string } {
  const url = process.env.DATABASE_URL;
  if (!url) return {};

  try {
    const normalized = normalizeDatabaseUrl(url);
    const parsed = new URL(normalized.replace(/^postgresql:/, "http:"));
    return {
      host: parsed.hostname,
      name: parsed.pathname.replace(/^\//, ""),
    };
  } catch {
    return {};
  }
}

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
    const connectionString = normalizeDatabaseUrl(url);
    pool = new Pool({
      connectionString,
      ssl: poolSsl(connectionString),
    });
  }

  return pool;
}

export async function checkDatabase(): Promise<boolean> {
  try {
    await getPool().query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export async function getOrderStats(): Promise<{
  count: number;
  recent: { order_id: string; name: string; phone: string; created_at: string }[];
}> {
  const db = getPool();
  const countResult = await db.query("SELECT COUNT(*)::int AS count FROM orders");
  const recentResult = await db.query(
    `SELECT order_id, name, phone, created_at::text
     FROM orders ORDER BY created_at DESC LIMIT 5`
  );

  return {
    count: countResult.rows[0].count,
    recent: recentResult.rows,
  };
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

  // Checkout v2: shipping detail + payment-gateway columns (safe to re-run).
  await db.query(`
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS city VARCHAR(255),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(30) DEFAULT 'cod',
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255)
  `);
  await db.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_reference_idx
      ON orders(payment_reference) WHERE payment_reference IS NOT NULL
  `);

  schemaReady = true;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

async function ensureContactSchema(): Promise<void> {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function saveContactMessage(body: ContactInput): Promise<void> {
  if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    throw new Error("Missing required fields: name, email, message");
  }

  await ensureContactSchema();

  const db = getPool();
  await db.query(
    `INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)`,
    [body.name.trim(), body.email.trim(), body.message.trim()]
  );
}

export interface OrderInput {
  name: string;
  phone: string;
  country: string;
  items: { productId: number; quantity: number; isUpsell?: boolean }[];
  total: number;
  currency: string;
  city?: string;
  address?: string;
  paymentMethod?: string;
}

function generateOrderId(): string {
  return `NQ-${Date.now().toString(36).toUpperCase()}`;
}

/** Look up product name/price for the TikTok CAPI "contents" array. */
function toTikTokItems(
  items: { productId: number; quantity: number }[]
): { id: string; name: string; price: number; quantity: number }[] {
  return items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        id: String(product.id),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    })
    .filter((item): item is { id: string; name: string; price: number; quantity: number } => item !== null);
}

export async function saveOrder(body: OrderInput): Promise<{ orderId: string }> {
  if (!body.name?.trim() || !body.phone?.trim() || !body.items?.length) {
    throw new Error("Missing required fields: name, phone, items");
  }

  await ensureSchema();

  const orderId = generateOrderId();
  const db = getPool();
  const client = await db.connect();
  const target = getDatabaseTarget();
  const paymentMethod = body.paymentMethod ?? "cod";
  const paymentStatus = paymentMethod === "cod" ? "cod_pending" : "pending";

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO orders (order_id, name, phone, country, total, currency, status, city, address, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7, $8, $9, $10)`,
      [
        orderId,
        body.name.trim(),
        body.phone.trim(),
        body.country,
        body.total,
        body.currency,
        body.city?.trim() ?? null,
        body.address?.trim() ?? null,
        paymentMethod,
        paymentStatus,
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
    console.log(
      `[orders] saved ${orderId} → db=${target.name} host=${target.host}`
    );
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

  try {
    const { buildSheetPayload, sendOrderWebhook } = await import("./sheet-webhook");
    const sheetPayload = buildSheetPayload(
      orderId,
      body.name,
      body.phone,
      body.country as import("./pricing").CountryCode,
      body.items,
      body.total,
      body.currency
    );
    await sendOrderWebhook(sheetPayload);
    console.log(`[orders] webhook sent ${orderId}`);
  } catch (err) {
    console.error(
      `[orders] webhook failed ${orderId}:`,
      err instanceof Error ? err.message : err
    );
  }

  try {
    await sendTikTokPurchaseEvent({
      orderId,
      phone: body.phone,
      country: body.country as import("./pricing").CountryCode,
      currency: body.currency,
      value: body.total,
      items: toTikTokItems(body.items),
    });
  } catch (err) {
    console.error(
      `[orders] TikTok CAPI failed ${orderId}:`,
      err instanceof Error ? err.message : err
    );
  }

  return { orderId };
}

// ─── Gateway checkout (card / Apple Pay / Tabby / Tamara) ───────────────────
//
// Two-phase flow: create a *pending* order when the gateway session/intent is
// created, then confirm it via `markOrderPaid` once the provider's webhook (or
// a verified return) confirms the payment. This keeps COD's `saveOrder` (which
// finalizes immediately, since "payment" happens on delivery) completely
// separate from the electronic-payment path, which must never create a
// finalized order before money has actually moved.

export interface PendingOrderInput {
  name: string;
  phone: string;
  country: string;
  items: { productId: number; quantity: number; isUpsell?: boolean }[];
  total: number;
  currency: string;
  city?: string;
  address?: string;
  paymentMethod: "card" | "apple_pay" | "tabby" | "tamara";
}

export async function createPendingOrder(
  body: PendingOrderInput
): Promise<{ orderId: string }> {
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
      `INSERT INTO orders (order_id, name, phone, country, total, currency, status, city, address, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7, $8, $9, 'pending')`,
      [
        orderId,
        body.name.trim(),
        body.phone.trim(),
        body.country,
        body.total,
        body.currency,
        body.city?.trim() ?? null,
        body.address?.trim() ?? null,
        body.paymentMethod,
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

  return { orderId };
}

/** Store the gateway's own session/order id right after creating it, so it can be looked up later even before payment is confirmed (support, reconciliation, or webhooks that only carry the gateway's id). */
export async function setOrderPaymentReference(
  orderId: string,
  paymentReference: string
): Promise<void> {
  const db = getPool();
  await db.query(
    `UPDATE orders SET payment_reference = COALESCE(payment_reference, $2) WHERE order_id = $1`,
    [orderId, paymentReference]
  );
}

export async function findOrderIdByPaymentReference(
  paymentReference: string
): Promise<string | null> {
  const db = getPool();
  const result = await db.query(
    `SELECT order_id FROM orders WHERE payment_reference = $1`,
    [paymentReference]
  );
  return result.rows[0]?.order_id ?? null;
}

/**
 * Idempotently confirm payment for a pending order. Safe to call more than
 * once (e.g. a webhook retry) — only the first call flips the status and
 * fires the side effects (tracking event + Google Sheet sync).
 *
 * Returns `false` if the order was already paid (or doesn't exist), so the
 * caller can treat repeat webhook deliveries as a no-op.
 */
export async function markOrderPaid(
  orderId: string,
  paymentReference: string,
  gateway: string
): Promise<boolean> {
  const db = getPool();
  const result = await db.query(
    `UPDATE orders
        SET payment_status = 'paid', payment_reference = COALESCE(payment_reference, $2)
      WHERE order_id = $1 AND payment_status <> 'paid'
      RETURNING order_id, name, phone, country, total, currency`,
    [orderId, paymentReference]
  );

  if (result.rowCount === 0) return false;

  const order = result.rows[0] as {
    order_id: string;
    name: string;
    phone: string;
    country: string;
    total: string;
    currency: string;
  };

  try {
    await db.query(
      `INSERT INTO tracking_events (order_id, event, metadata) VALUES ($1, 'payment_confirmed', $2)`,
      [orderId, JSON.stringify({ gateway, paymentReference })]
    );
  } catch {
    // non-fatal
  }

  try {
    const itemsResult = await db.query<{
      productId: number;
      quantity: number;
      isUpsell: boolean;
    }>(
      `SELECT product_id AS "productId", quantity, is_upsell AS "isUpsell"
         FROM order_items WHERE order_id = $1`,
      [orderId]
    );
    const { buildSheetPayload, sendOrderWebhook } = await import("./sheet-webhook");
    const sheetPayload = buildSheetPayload(
      order.order_id,
      order.name,
      order.phone,
      order.country as import("./pricing").CountryCode,
      itemsResult.rows,
      Number(order.total),
      order.currency
    );
    await sendOrderWebhook(sheetPayload);
    console.log(`[orders] payment confirmed + synced ${orderId} via ${gateway}`);

    await sendTikTokPurchaseEvent({
      orderId: order.order_id,
      phone: order.phone,
      country: order.country as import("./pricing").CountryCode,
      currency: order.currency,
      value: Number(order.total),
      items: toTikTokItems(itemsResult.rows),
    });
  } catch (err) {
    console.error(
      `[orders] payment-confirmed webhook failed ${orderId}:`,
      err instanceof Error ? err.message : err
    );
  }

  return true;
}

export async function getOrderPaymentStatus(
  orderId: string
): Promise<{ paymentStatus: string; paymentMethod: string } | null> {
  const db = getPool();
  const result = await db.query(
    `SELECT payment_status AS "paymentStatus", payment_method AS "paymentMethod"
       FROM orders WHERE order_id = $1`,
    [orderId]
  );
  return result.rows[0] ?? null;
}
