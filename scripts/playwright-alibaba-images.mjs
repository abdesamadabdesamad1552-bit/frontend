import { chromium } from "playwright";
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

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const out = {};

for (const [slug, url] of Object.entries(PRODUCTS)) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(5000);

  const imgs = await page.evaluate(() => {
    const urls = new Set();
    document.querySelectorAll("img").forEach((img) => {
      const src = img.src || img.getAttribute("data-src") || "";
      if (src.includes("alicdn.com/kf/") && !/_\d+x\d+/.test(src)) urls.add(src.split("?")[0]);
    });
    const html = document.documentElement.innerHTML;
    for (const m of html.matchAll(/https?:\/\/sc0[0-9]\.alicdn\.com\/kf\/[^"'\s\\]+/g)) {
      const u = m[0].split("?")[0];
      if (!/_\d+x\d+/.test(u)) urls.add(u);
    }
    return [...urls];
  });

  out[slug] = imgs;
  console.log(`\n${slug}: ${imgs.length}`);
  imgs.slice(0, 8).forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
}

fs.writeFileSync("alibaba-playwright-images.json", JSON.stringify(out, null, 2));
await browser.close();
