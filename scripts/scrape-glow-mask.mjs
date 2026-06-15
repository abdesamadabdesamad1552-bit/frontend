import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("https://www.alibaba.co.uk/product-detail/_1601632943825.html", {
  waitUntil: "domcontentloaded",
  timeout: 90000,
});
await page.waitForTimeout(5000);

const imgs = await page.evaluate(() => {
  const urls = [];
  const seen = new Set();
  const skip = ["Hfddaf74a86174ede9cc528d9da95f789D", "H36976abd62fb46ef8ed67f86ae2ccff1s"];
  const add = (raw) => {
    const u = (raw || "").split("?")[0];
    if (!u.includes("alicdn.com/kf/")) return;
    if (skip.some((s) => u.includes(s))) return;
    const full = u.startsWith("http") ? u : `https://${u}`;
    if (seen.has(full)) return;
    seen.add(full);
    urls.push(full);
  };
  for (const m of document.documentElement.innerHTML.matchAll(
    /https?:\/\/sc0[0-9]\.alicdn\.com\/kf\/[^"'\s\\]+/g
  )) {
    add(m[0]);
  }
  return urls.filter((u) => !/_\d+x\d+/.test(u));
});

console.log(`found ${imgs.length}`);
imgs.forEach((u, i) => console.log(`${i + 1}. ${u}`));
await browser.close();
