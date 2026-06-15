import fs from "fs";

const url =
  "https://www.alibaba.com/product-detail/LANBENA-Skin-Anti-Acne-Serum-with_1601195297445.html";
const res = await fetch(url, {
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122" },
});
const html = await res.text();

const all = [...html.matchAll(/https?:[^"'\s<>]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);
const unique = [...new Set(all)].filter((u) => !/logo|icon|avatar|banner|tps-\d+-40|tps-60-60/i.test(u));
console.log("total unique", unique.length);
unique.slice(0, 30).forEach((u) => console.log(u));

// Also check escaped URLs
const esc = [...html.matchAll(/https?:\\\/\\\/[^"\\]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) =>
  m[0].replace(/\\\//g, "/")
);
console.log("\nescaped:", [...new Set(esc)].slice(0, 15));
