const url =
  "https://www.alibaba.com/product-detail/Private-Label-Ladies-VC-Serum-Vitamin_1601356738984.html";
const res = await fetch(url, {
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122" },
});
const html = await res.text();
console.log("length", html.length);

const patterns = [
  /sc0[0-9]\.alicdn\.com\/kf\/[^"'\s\\<>]+/g,
  /img\.alicdn\.com\/imgextra\/[^"'\s\\<>]+/g,
  /"imageUrl":"([^"]+)"/g,
  /"original":"([^"]+alicdn[^"]+)"/g,
  /"fullPathImageURI":"([^"]+)"/g,
];

for (const p of patterns) {
  const matches = [...html.matchAll(p)].map((m) => m[1] ?? m[0]);
  const unique = [...new Set(matches)];
  if (unique.length) {
    console.log("\n", p, "->", unique.length);
    unique.slice(0, 8).forEach((u) => console.log(" ", u.startsWith("http") ? u : `https://${u}`));
  }
}
