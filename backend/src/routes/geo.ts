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

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.ip || "";
}

async function detectWithMaxMind(ip: string): Promise<{ country: string; source: string } | null> {
  const accountId = process.env.MAXMIND_ACCOUNT_ID;
  const licenseKey = process.env.MAXMIND_LICENSE_KEY;
  if (!accountId || !licenseKey || !ip) return null;

  try {
    const auth = Buffer.from(`${accountId}:${licenseKey}`).toString("base64");
    const response = await fetch(`https://geoip.maxmind.com/geoip/v2.1/country/${ip}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { country?: { iso_code?: string } };
    const code = data.country?.iso_code || "";
    const country = COUNTRY_MAP[code] || "SA";

    return { country, source: "maxmind" };
  } catch {
    return null;
  }
}

async function detectWithGeoIpApi(ip: string): Promise<{ country: string; source: string } | null> {
  const apiKey = process.env.GEOIP_API_KEY;
  if (!apiKey || !ip) return null;

  try {
    const response = await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}&fields=country_code2`
    );
    const data = (await response.json()) as { country_code2?: string };
    const code = data.country_code2 || "";
    const country = COUNTRY_MAP[code] || "SA";

    return { country, source: "geoip" };
  } catch {
    return null;
  }
}

geoRoutes.get("/detect", async (req: Request, res: Response) => {
  const ip = getClientIp(req);

  const maxmind = await detectWithMaxMind(ip);
  if (maxmind) {
    res.json(maxmind);
    return;
  }

  const geoip = await detectWithGeoIpApi(ip);
  if (geoip) {
    res.json(geoip);
    return;
  }

  res.json({ country: "SA", source: "default" });
});
