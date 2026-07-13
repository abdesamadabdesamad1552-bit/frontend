import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "نقاء للتجميل الفاخر — Naqa Beauty",
    short_name: "نقاء",
    description:
      "تركيبات علمية بمكونات فعّالة بتركيزات حقيقية — مصممة لمناخ الخليج. توصيل مجاني. الدفع عند الاستلام.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a1a1a",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
