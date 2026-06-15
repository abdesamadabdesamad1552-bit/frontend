const OFFERS = {
  "radiance-serum": "1601356738984",
  "glow-mask": "1601632943825",
  "hair-density-serum": "1601709360545",
  "eye-retinol-cream": "1601585717811",
  "clarity-gel": "10000030442030",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36";

const endpoints = (id) => [
  `https://www.alibaba.com/product-photobank/ajax/v2/getImageBankFromOffer.htm?offerId=${id}`,
  `https://www.alibaba.com/product-detail/ajax/product.html?id=${id}`,
  `https://www.alibaba.com/event/app/mainAction/describe/OfferDetailDescription.htm?offerId=${id}`,
  `https://m.alibaba.com/product/${id}.html`,
];

for (const [slug, id] of Object.entries(OFFERS)) {
  console.log(`\n${slug}:`);
  for (const url of endpoints(id)) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Referer: "https://www.alibaba.com/" },
      });
      const text = await res.text();
      const imgs = [
        ...new Set(
          [...text.matchAll(/https?:\/\/sc0[0-9]\.alicdn\.com\/kf\/[^"'\s\\<>]+/g)].map((m) =>
            m[0].split("?")[0]
          )
        ),
      ].filter((u) => !/_\d+x\d+/.test(u));
      if (imgs.length) {
        console.log(`  ${url.split("/").pop()?.slice(0, 40)} → ${imgs.length}`);
        imgs.slice(0, 6).forEach((u) => console.log(`    ${u}`));
      }
    } catch (e) {
      console.log(`  err: ${e.message}`);
    }
  }
}
