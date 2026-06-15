const urls = [
  "https://www.alibaba.com/product-detail/AiXin-Private-Label-30ML-Repairs-Skin_1600944800369.html",
  "https://www.alibaba.com/product-detail/LANBENA-Skin-Anti-Acne-Serum-with_1601195297445.html",
  "https://www.alibaba.com/product-detail/OEM-Private-Label-SADOER-Salicylic-Acid_1601386729999.html",
];

for (const url of urls) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122" },
  });
  const html = await res.text();
  const imgs = [...new Set([...html.matchAll(/sc0[0-9]\.alicdn\.com\/kf\/[^"'\s\\<>]+/g)].map((m) => m[0]))]
    .filter((u) => !/_\d+x\d+/.test(u));
  console.log("\n", url.split("_").pop(), "→", imgs.length, "images");
  imgs.slice(0, 5).forEach((u) => console.log(" ", "https://" + u));
}
