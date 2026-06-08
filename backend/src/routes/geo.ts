import { Router, type Request, type Response } from "express";

export const geoRoutes = Router();

const COUNTRY_MAP: Record<string, string> = {
  SA: "SA",
  AE: "AE",
  KW: "KW",
  QA: "QA",
  BH: "BH",
  OM: "OM",
};

geoRoutes.get("/detect", async (req: Request, res: Response) => {
  const apiKey = process.env.GEOIP_API_KEY;
  const forwarded = req.headers["x-forwarded-for"];
  const ip = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.ip;

  if (!apiKey) {
    res.json({ country: "SA", source: "default" });
    return;
  }

  try {
    const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}&fields=country_code2`);
    const data = (await response.json()) as { country_code2?: string };
    const code = data.country_code2 || "";
    const country = COUNTRY_MAP[code] || "SA";

    res.json({ country, source: "geoip" });
  } catch {
    res.json({ country: "SA", source: "fallback" });
  }
});
