const id = "1601356738984";
const urls = [
  `https://m.alibaba.com/product/${id}.html`,
  `https://www.alibaba.com/product-detail/v2/${id}.html`,
  `https://www.alibaba.com/product-detail/ajax/product.html?id=${id}`,
  `https://hot-product.alibaba.com/hot-products/getProductDesc.htm?productId=${id}`,
  `https://www.alibaba.com/event/app/mainAction/describe/OfferDetailDescription.htm?offerId=${id}`,
  `https://s.alibaba.com/athena/offer/${id}.htm`,
  `https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&SearchText=${id}`,
];

const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148";

for (const url of urls) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  const text = await res.text();
  const imgs = [...new Set([...text.matchAll(/sc0[0-9]\.alicdn\.com\/kf\/[^"'\s\\<>]+/g)].map((m) => m[0]))]
    .filter((u) => !/_\d+x\d+/.test(u));
  console.log(url.slice(0, 70), "->", res.status, "len", text.length, "imgs", imgs.length);
  imgs.slice(0, 5).forEach((u) => console.log(" ", u));
}
