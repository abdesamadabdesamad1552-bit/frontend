import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "نقاء للتجميل الفاخر — Naqa Beauty";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Load IBM Plex Sans Arabic (bold) for crisp Arabic glyphs in the OG image.
async function loadArabicFont(weight: 400 | 700) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@${weight}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0" } }
  ).then((res) => res.text());

  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype|woff2)'\)/)?.[1];
  if (!url) throw new Error("Failed to resolve IBM Plex Sans Arabic font URL");

  return fetch(url).then((res) => res.arrayBuffer());
}

export default async function OpengraphImage() {
  const [regular, bold] = await Promise.all([loadArabicFont(400), loadArabicFont(700)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a1a 0%, #262320 60%, #1a1a1a 100%)",
          fontFamily: "IBM Plex Sans Arabic",
          position: "relative",
        }}
      >
        {/* Gold hairline frame */}
        <div
          style={{
            position: "absolute",
            inset: 40,
            border: "1px solid rgba(197,165,90,0.45)",
            borderRadius: 24,
          }}
        />

        {/* Latin eyebrow */}
        <div
          style={{
            color: "#c5a55a",
            fontSize: 26,
            letterSpacing: 14,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          NAQA BEAUTY
        </div>

        {/* Arabic wordmark */}
        <div
          style={{
            color: "#ffffff",
            fontSize: 150,
            fontWeight: 700,
            lineHeight: 1,
            marginBottom: 28,
          }}
        >
          نقاء
        </div>

        {/* Gold divider */}
        <div
          style={{
            width: 120,
            height: 3,
            background: "#c5a55a",
            borderRadius: 3,
            marginBottom: 28,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            color: "#e8dfd5",
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          لأن بشرتك تستحق الأنقى
        </div>

        {/* Sub-line */}
        <div
          style={{
            color: "#9ca3af",
            fontSize: 26,
            fontWeight: 400,
            marginTop: 18,
          }}
        >
          تركيبات علمية · توصيل مجاني · الدفع عند الاستلام
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "IBM Plex Sans Arabic", data: regular, weight: 400, style: "normal" },
        { name: "IBM Plex Sans Arabic", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
