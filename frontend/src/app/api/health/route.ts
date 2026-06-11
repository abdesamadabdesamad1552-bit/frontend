import {
  checkDatabase,
  getDatabaseTarget,
  getOrderStats,
} from "@/lib/db";

export async function GET() {
  const target = getDatabaseTarget();

  if (!process.env.DATABASE_URL) {
    return Response.json({
      status: "degraded",
      database: "not configured",
      hint: "Set DATABASE_URL on frontend service in Easypanel",
      dbHost: target.host,
      dbName: target.name,
    });
  }

  const connected = await checkDatabase();
  if (!connected) {
    return Response.json({
      status: "degraded",
      database: "disconnected",
      dbHost: target.host,
      dbName: target.name,
    });
  }

  try {
    const stats = await getOrderStats();
    return Response.json({
      status: "ok",
      database: "connected",
      dbHost: target.host,
      dbName: target.name,
      orderCount: stats.count,
      recentOrders: stats.recent,
    });
  } catch (err) {
    return Response.json({
      status: "degraded",
      database: "connected",
      dbHost: target.host,
      dbName: target.name,
      error: err instanceof Error ? err.message : "Could not read orders",
    });
  }
}
