import { chromium } from "playwright";

const ids = {
  "radiance-serum": "1601356738984",
  "glow-mask": "1601632943825",
  "hair-density-serum": "1601709360545",
  "eye-retinol-cream": "1601585717811",
};

const mirrors = (id) => [
  `https://www.alibaba.co.uk/product-detail/_${id}.html`,
  `https://www.alibaba.com/product-detail/x/${id}.html`,
  `https://sale.alibaba.com/p/${id}.html`,
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const [slug, id] of Object.entries(ids)) {
  for (const url of mirrors(id)) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(4000);
      const imgs = await page.evaluate(() => {
        const urls = new Set();
        for (const m of document.documentElement.innerHTML.matchAll(
          /https?:\/\/sc0[0-9]\.alicdn\.com\/kf\/[^"'\s\\]+/g
        )) {
          const u = m[0].split("?")[0];
          if (!/_\d+x\d+/.test(u)) urls.add(u);
        }
        return [...urls];
      });
      if (imgs.length) {
        console.log(`\n${slug} @ ${url}: ${imgs.length}`);
        imgs.slice(0, 6).forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
      }
    } catch (e) {
      console.log(`${slug} ${url}: ${e.message.slice(0, 60)}`);
    }
  }
}

await browser.close();
