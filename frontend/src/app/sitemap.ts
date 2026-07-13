import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

const BASE_URL = "https://naqabeauty.store";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/returns`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
