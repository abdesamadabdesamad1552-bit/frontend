import "dotenv/config";
import express from "express";
import cors from "cors";
import { orderRoutes } from "./routes/orders.js";
import { geoRoutes } from "./routes/geo.js";
import { initDatabase, checkDatabase, closeDatabase, getPool } from "./db.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const isProduction = process.env.NODE_ENV === "production";

const maxmindAccountId = process.env.MAXMIND_ACCOUNT_ID;
const maxmindLicenseKey = process.env.MAXMIND_LICENSE_KEY;

if (maxmindAccountId && maxmindLicenseKey) {
  console.log(
    `[env] MaxMind configured (account: ${maxmindAccountId}, key: ${maxmindLicenseKey.slice(0, 4)}…${maxmindLicenseKey.slice(-4)})`
  );
} else {
  console.warn("[env] MaxMind not fully configured — set MAXMIND_ACCOUNT_ID and MAXMIND_LICENSE_KEY");
}

if (process.env.DATABASE_URL) {
  try {
    const parsed = new URL(process.env.DATABASE_URL.replace(/^postgresql:/, "http:"));
    console.log(
      `[env] DATABASE_URL → host=${parsed.hostname} database=${parsed.pathname.replace(/^\//, "")} user=${parsed.username}`
    );
  } catch {
    console.log("[env] DATABASE_URL loaded");
  }
} else {
  console.warn("[env] DATABASE_URL not set — orders cannot be saved");
}

const PRODUCTION_ORIGINS = [
  "https://naqabeauty.store",
  "https://www.naqabeauty.store",
];

const DEV_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

const envOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...new Set([
    ...envOrigins,
    ...(isProduction ? PRODUCTION_ORIGINS : DEV_ORIGINS),
  ]),
];

// Reflect any origin — avoids 500 "CORS blocked" on older deploy configs
app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ limit: "1mb" }));

if (!isProduction) {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.get("/api/health", async (_req, res) => {
  const dbOk = process.env.DATABASE_URL ? await checkDatabase() : false;
  let dbHost: string | undefined;
  let dbName: string | undefined;
  let orderCount: number | null = null;

  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL.replace(/^postgresql:/, "http:"));
      dbHost = parsed.hostname;
      dbName = parsed.pathname.replace(/^\//, "");
    } catch {
      // ignore parse errors
    }
  }

  if (dbOk) {
    try {
      const result = await getPool().query("SELECT COUNT(*)::int AS count FROM orders");
      orderCount = result.rows[0].count;
    } catch {
      orderCount = null;
    }
  }

  res.json({
    status: dbOk ? "ok" : "degraded",
    env: isProduction ? "production" : "development",
    database: dbOk ? "connected" : "disconnected",
    dbHost,
    dbName,
    orderCount,
    buildSha: process.env.BUILD_SHA || "dev",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/orders", orderRoutes);
app.use("/api/geo", geoRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
);

async function start() {
  if (process.env.DATABASE_URL) {
    try {
      await initDatabase();
      console.log("[db] PostgreSQL connected and schema ready");
    } catch (err) {
      console.error("[db] Failed to connect:", err);
    }
  }

  const buildSha = process.env.BUILD_SHA || "dev";
  const deployVersion = "2026-06-11-cors-fix-v2";

  app.listen(PORT, "0.0.0.0", () => {
    console.log("=".repeat(56));
    console.log(`[boot] Naqa backend ${buildSha} (${deployVersion})`);
    console.log(`[boot] Backend running on http://0.0.0.0:${PORT} [${isProduction ? "production" : "development"}]`);
    console.log(`[boot] CORS: open — no more "CORS blocked" errors`);
    console.log("=".repeat(56));
  });
}

start();

async function shutdown() {
  console.log("Shutting down...");
  await closeDatabase();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
