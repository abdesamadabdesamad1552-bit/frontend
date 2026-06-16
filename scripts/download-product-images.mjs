import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "frontend", "public", "images");

/** Alibaba product pages (co.uk mirror loads gallery without captcha) */
const PRODUCTS = {
  "radiance-serum": {
    url: "https://www.alibaba.co.uk/product-detail/_1601356738984.html",
    maxImages: 1,
    fallback: [
      "https://sc04.alicdn.com/kf/H49ec962d47664072b4f19c0df3b3c63dX.jpg",
    ],
  },
  "glow-mask": {
    "url": "https://www.alibaba.co.uk/product-detail/_1601632943825.html",
    maxImages: 4,
    fallback: [
      "https://sc04.alicdn.com/kf/H8ac1ada36e7c42d5abc31d6c78b7c2bb6.jpg",
      "https://sc04.alicdn.com/kf/H891385baf5874b8eb013017bfa13d5a99.jpg",
      "https://sc04.alicdn.com/kf/Hca9b51921ad042e7b90b6276816156bdX.jpg",
      "https://sc04.alicdn.com/kf/Hb5ab38c5dcdf44ef9f0ff24b885d4920C.jpg",
    ],
  },
  "hair-density-serum": {
    url: "https://www.alibaba.co.uk/product-detail/_1601709360545.html",
    maxImages: 4,
    fallback: [
      "https://sc04.alicdn.com/kf/Hed62e121bc184d26a26974d588a54b12n.jpg",
      "https://sc04.alicdn.com/kf/H6f743512dea04ac68cba2a6062f1507eO.jpg",
      "https://sc04.alicdn.com/kf/H0ea90cbc429148db938f397852665a5cZ.jpg",
      "https://sc04.alicdn.com/kf/Hc5738c2533594b678a430b9b3eeb903bV.jpg",
    ],
  },
  "eye-retinol-cream": {
    url: "https://www.alibaba.co.uk/product-detail/_1601585717811.html",
    maxImages: 4,
    fallback: [
      "https://sc04.alicdn.com/kf/H781f11938a4148e797ed1f91e9bdd8b3N.jpg",
      "https://sc04.alicdn.com/kf/Hdba07aa500db4d94bcea928357cbb066j.jpg",
      "https://sc04.alicdn.com/kf/Hbf5f3bee486a4bb19aed2572e3bf5d2f5.jpg",
      "https://sc04.alicdn.com/kf/H48d5252160324b098fbf5e9001047436v.jpg",
    ],
  },
  "clarity-gel": {
    url: "https://www.alibaba.co.th/product-detail/Deep-Cleansing-Serum-with-2-Percent_10000030442030.html",
    maxImages: 4,
    fallback: [
      "https://sc04.alicdn.com/kf/Aaea393836d9b483fa5149c022ef813d3d.png",
      "https://sc04.alicdn.com/kf/Aff5e3fef5c234baa97d25b2f799eb688N.png",
      "https://sc04.alicdn.com/kf/A3ae92469441f4c06a293c2f47c380de7p.png",
      "https://sc04.alicdn.com/kf/A3a3e4d3a6df34477ba15b8e9b90e6959J.png",
    ],
  },
};

const SLOTS = ["1-hero", "2-usage", "3-results", "4-size", "5-packaging"];
const MAX_IMAGES = 5;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36";

/** Shared supplier banners — skip when scraping */
const SKIP_HASHES = new Set([
  "Hfddaf74a86174ede9cc528d9da95f789D",
  "H36976abd62fb46ef8ed67f86ae2ccff1s",
]);

function isProductImage(url) {
  const hash = url.split("/kf/")[1]?.split(".")[0] ?? "";
  if (SKIP_HASHES.has(hash)) return false;
  if (url.includes("imgextra")) return false;
  if (/_\d+x\d+/.test(url)) return false;
  return url.includes("alicdn.com/kf/");
}

async function scrapeGallery(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(5000);
  const imgs = await page.evaluate(() => {
    const urls = [];
    const seen = new Set();
    const add = (raw) => {
      const u = raw.split("?")[0];
      if (!u.includes("alicdn.com/kf/")) return;
      if (seen.has(u)) return;
      seen.add(u);
      urls.push(u);
    };
    document.querySelectorAll("img").forEach((img) => {
      add(img.src || img.getAttribute("data-src") || "");
    });
    for (const m of document.documentElement.innerHTML.matchAll(
      /https?:\/\/sc0[0-9]\.alicdn\.com\/kf\/[^"'\s\\]+/g
    )) {
      add(m[0]);
    }
    return urls;
  });
  return imgs.filter(isProductImage);
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Referer: "https://www.alibaba.com/" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) throw new Error(`too small (${buf.length}b)`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const [slug, { url, fallback, maxImages = MAX_IMAGES }] of Object.entries(PRODUCTS)) {
  const dir = path.join(OUT, slug);
  fs.mkdirSync(dir, { recursive: true });
  console.log(`\n${slug}:`);

  let gallery = [];
  if (maxImages > fallback.length) {
    try {
      gallery = await scrapeGallery(page, url);
      console.log(`  scraped ${gallery.length} images`);
    } catch (e) {
      console.log(`  scrape failed: ${e.message}`);
    }
  }

  const pool = [...new Set([...fallback, ...gallery])];
  let poolIdx = 0;
  const slots = SLOTS.slice(0, maxImages);

  for (const slot of SLOTS.slice(maxImages)) {
    const extra = path.join(dir, `${slot}.webp`);
    if (fs.existsSync(extra)) {
      fs.unlinkSync(extra);
      console.log(`  - removed ${slot}.webp`);
    }
  }

  for (let i = 0; i < slots.length; i++) {
    const dest = path.join(dir, `${slots[i]}.webp`);
    let saved = false;

    while (poolIdx < pool.length && !saved) {
      const imageUrl = pool[poolIdx++];
      try {
        const bytes = await download(imageUrl, dest);
        console.log(`  ✓ ${slots[i]}.webp (${bytes} bytes)`);
        saved = true;
      } catch (e) {
        console.log(`  · skip ${imageUrl.split("/").pop()}: ${e.message}`);
      }
    }

    if (!saved) console.log(`  ✗ ${slots[i]}: no valid image found`);
  }
}

await browser.close();
console.log("\nDone.");
