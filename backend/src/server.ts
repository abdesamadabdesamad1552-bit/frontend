import "dotenv/config";
import express from "express";
import cors from "cors";
import { orderRoutes } from "./routes/orders.js";
import { geoRoutes } from "./routes/geo.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const isProduction = process.env.NODE_ENV === "production";

// ━━━ MaxMind GeoIP (Account ID + License Key) ━━━
const maxmindAccountId = process.env.MAXMIND_ACCOUNT_ID;
const maxmindLicenseKey = process.env.MAXMIND_LICENSE_KEY;

if (maxmindAccountId && maxmindLicenseKey) {
  console.log(`[env] MaxMind configured (account: ${maxmindAccountId}, key: ${maxmindLicenseKey.slice(0, 4)}…${maxmindLicenseKey.slice(-4)})`);
} else {
  console.warn("[env] MaxMind not fully configured — set MAXMIND_ACCOUNT_ID and MAXMIND_LICENSE_KEY");
}

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((u) => u.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

if (!isProduction) {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    env: isProduction ? "production" : "development",
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

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://localhost:${PORT} [${isProduction ? "production" : "development"}]`);
});

function shutdown() {
  console.log("Shutting down...");
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
