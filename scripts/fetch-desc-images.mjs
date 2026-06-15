const OFFERS = {
  "radiance-serum": "1601356738984",
  "glow-mask": "1601632943825",
  "hair-density-serum": "1601709360545",
  "eye-retinol-cream": "1601585717811",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36";

for (const [slug, id] of Object.entries(OFFERS)) {
  const url = `https://www.alibaba.com/event/app/mainAction/describe/OfferDetailDescription.htm?offerId=${id}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Referer: "https://www.alibaba.com/" } });
  const html = await res.text();
  const imgs = [
    ...new Set(
      [...html.matchAll(/https?:\/\/sc0[0-9]\.alicdn\.com\/kf\/[^"'\s<>]+/g)].map((m) => m[0].split("?")[0])
    ),
  ].filter((u) => !/_\d+x\d+/.test(u));
  console.log(`\n${slug}: ${imgs.length} desc images`);
  imgs.slice(0, 8).forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
}
