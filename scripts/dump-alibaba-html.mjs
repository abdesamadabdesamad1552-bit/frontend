import fs from "fs";

const url =
  "https://www.alibaba.com/product-detail/Private-Label-Ladies-VC-Serum-Vitamin_1601356738984.html";
const res = await fetch(url, {
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122" },
});
const html = await res.text();
fs.writeFileSync("alibaba-sample.html", html);

// Search for any image-related JSON keys
const keys = [
  "imageList",
  "imageUrl",
  "originalImage",
  "summImageList",
  "mediaItems",
  "offerImageList",
  "productImageList",
  "gallery",
  "sc04.alicdn",
  "sc01.alicdn",
];

for (const k of keys) {
  const idx = html.indexOf(k);
  if (idx !== -1) {
    console.log(`\n${k} @ ${idx}:`);
    console.log(html.slice(idx, idx + 400).replace(/\s+/g, " "));
  }
}

// Find all alicdn mentions
const all = [...html.matchAll(/alicdn[^"'\s]{0,120}/g)].map((m) => m[0]);
console.log("\nall alicdn fragments:", all.length);
[...new Set(all)].slice(0, 20).forEach((u) => console.log(" ", u));
