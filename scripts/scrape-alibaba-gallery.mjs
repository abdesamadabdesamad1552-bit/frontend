import fs from "fs";

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
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function extractAll(html) {
  const found = new Set();
  const patterns = [
    /https?:\/\/sc0[0-9]\.alicdn\.com\/kf\/[^"'\s\\<>]+/g,
    /sc0[0-9]\.alicdn\.com\/kf\/[^"'\s\\<>]+/g,
    /https?:\/\/img\.alicdn\.com\/imgextra\/[^"'\s\\<>]+/g,
    /"original":"(https?:\/\/[^"]+)"/g,
    /"imageUrl":"(https?:\/\/[^"]+)"/g,
    /"fullPathImageURI":"(https?:\/\/[^"]+)"/g,
    /"imageMainUrl":"(https?:\/\/[^"]+)"/g,
  ];

  for (const p of patterns) {
    for (const m of html.matchAll(p)) {
      let u = (m[1] ?? m[0]).split("?")[0].replace(/\\u002F/g, "/");
      if (/_\d+x\d+/.test(u)) continue;
      if (/_80x80|_50x50|_120x120|_350x350/.test(u)) continue;
      if (u.includes("297-40")) continue;
      if (u.includes("O1CN01YyMrnH")) continue;
      if (!u.startsWith("http")) u = `https://${u}`;
      found.add(u);
    }
  }
  return [...found];
}

for (const [slug, url] of Object.entries(PRODUCTS)) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://www.alibaba.com/",
    },
  });
  const html = await res.text();
  const imgs = extractAll(html);
  console.log(`\n${slug}: ${imgs.length}`);
  imgs.forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
}
