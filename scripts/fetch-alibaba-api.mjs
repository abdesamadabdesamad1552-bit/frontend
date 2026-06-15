const OFFERS = {
  "radiance-serum": "1601356738984",
  "glow-mask": "1601632943825",
  "hair-density-serum": "1601709360545",
  "eye-retinol-cream": "1601585717811",
  "clarity-gel": "10000030442030",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36";

async function tryEndpoint(name, url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Referer: "https://www.alibaba.com/" } });
    const text = await res.text();
    const imgs = [
      ...new Set(
        [...text.matchAll(/https?:\/\/sc0[0-9]\.alicdn\.com\/kf\/[^"'\s\\<>]+/g)].map((m) =>
          m[0].split("?")[0]
        )
      ),
    ].filter((u) => !/_\d+x\d+/.test(u));
    if (imgs.length) console.log(`  ${name}: ${imgs.length} imgs`);
    return imgs;
  } catch {
    return [];
  }
}

for (const [slug, id] of Object.entries(OFFERS)) {
  console.log(`\n${slug} (${id})`);
  const endpoints = [
    ["detail-data", `https://www.alibaba.com/open/detail/data.htm?id=${id}`],
    ["offer-ajax", `https://offer.alibaba.com/offer/ajax/getOfferDetail.do?offerId=${id}`],
    ["m-site", `https://m.alibaba.com/product/${id}.html`],
    ["desc", `https://www.alibaba.com/event/app/mainAction/describe/OfferDetailDescription.htm?offerId=${id}`],
  ];
  const all = new Set();
  for (const [name, url] of endpoints) {
    const imgs = await tryEndpoint(name, url);
    imgs.forEach((u) => all.add(u));
  }
  console.log("  total unique:", all.size);
  [...all].slice(0, 6).forEach((u, i) => console.log(`    ${i + 1}. ${u}`));
}
