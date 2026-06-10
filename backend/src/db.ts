import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;

function poolSsl(connectionString: string): false | { rejectUnauthorized: boolean } {
  if (connectionString.includes("sslmode=disable")) return false;
  if (connectionString.includes("sslmode=require")) {
    return { rejectUnauthorized: false };
  }

  try {
    const host = new URL(connectionString.replace(/^postgresql:/, "http:")).hostname;
    // Easypanel / Docker internal Postgres — no SSL
    if (
      host === "database" ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".internal")
    ) {
      return false;
    }
  } catch {
    // fall through
  }

  return process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false;
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

export async function initDatabase(): Promise<void> {
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

  await db.query(`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC)`);
  await db.query(`CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders (phone)`);
  await db.query(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id)`);
  await db.query(`CREATE INDEX IF NOT EXISTS idx_tracking_events_order_id ON tracking_events (order_id)`);
}

export async function checkDatabase(): Promise<boolean> {
  try {
    const db = getPool();
    await db.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
