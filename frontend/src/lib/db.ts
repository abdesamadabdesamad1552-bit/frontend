import pg from "pg";

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
  const target = getDatabaseTarget();

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

  return { orderId };
}
