const PRODUCTS = {
  "radiance-serum": "https://www.alibaba.com/product-detail/OEM-Vitamin-C-Face-Serum-50ml_1601733518322.html",
  "glow-mask": "https://www.alibaba.com/product-detail/OEM-Face-Cream-GHK-CU-Copper_1601403534850.html",
  "hair-density-serum": "https://www.alibaba.com/product-detail/Private-Label-Redensyl-3-Hair-Growth_1601709360545.html",
  "eye-retinol-cream": "https://www.alibaba.com/product-detail/Cooling-Caffeine-Eye-Serum-Roller-for_1601725461863.html",
  "clarity-gel": "https://www.alibaba.com/product-detail/LANBENA-Skin-Anti-Acne-Serum-with_1601195297445.html",
};

function extractProductImages(html) {
  const raw = [...html.matchAll(/sc04\.alicdn\.com\/kf\/[^"'\s\\<>]+/g)].map((m) => m[0]);
  const urls = new Set();

  for (const u of raw) {
    // Skip thumbnails
    if (/_\d+x\d+/.test(u)) continue;
    if (u.includes("_80x80") || u.includes("_50x50") || u.includes("_350x350")) continue;

    const full = `https://${u.split("?")[0]}`;
    urls.add(full);
  }

  return [...urls];
}

for (const [slug, url] of Object.entries(PRODUCTS)) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122" },
  });
  const html = await res.text();
  const imgs = extractProductImages(html);
  console.log(`\n${slug}: ${imgs.length} product images`);
  imgs.forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
}
