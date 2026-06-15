/** Fetch gallery image URLs from chosen Alibaba product pages */
const PRODUCTS = {
  "radiance-serum":
    "https://www.alibaba.com/product-detail/Private-Label-Ladies-VC-Serum-Vitamin_1601356738984.html",
  "glow-mask":
    "https://www.alibaba.com/product-detail/Private-Label-Ghk-Cu-Anti-Age_1601632943825.html",
  "hair-density-serum":
    "https://www.alibaba.com/product-detail/Private-Label-Redensyl-3-Hair-Growth_1601709360545.html",
  "eye-retinol-cream":
    "https://www.alibaba.com/product-detail/Private-Label-Caffeine-Eye-Cream-Anti_1601585717811.html",
  "clarity-gel":
    "https://www.alibaba.co.th/product-detail/Deep-Cleansing-Serum-with-2-Percent_10000030442030.html",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36";

function extractProductImages(html) {
  const patterns = [
    /sc0[0-9]\.alicdn\.com\/kf\/[^"'\s\\<>]+/g,
    /img\.alicdn\.com\/imgextra\/[^"'\s\\<>]+/g,
  ];
  const urls = new Set();

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      let u = match[0].split("?")[0];
      if (/_\d+x\d+/.test(u)) continue;
      if (/_80x80|_50x50|_120x120|_350x350/.test(u)) continue;
      if (!u.startsWith("http")) u = `https://${u}`;
      urls.add(u);
    }
  }

  return [...urls];
}

const out = {};

for (const [slug, url] of Object.entries(PRODUCTS)) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    const html = await res.text();
    const imgs = extractProductImages(html).slice(0, 6);
    out[slug] = imgs;
    console.log(`\n${slug}: ${imgs.length} images`);
    imgs.forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
  } catch (e) {
    console.error(`${slug}: ${e.message}`);
    out[slug] = [];
  }
}

console.log("\n--- JSON ---\n");
console.log(JSON.stringify(out, null, 2));
