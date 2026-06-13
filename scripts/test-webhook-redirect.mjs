const url =
  "https://script.google.com/macros/s/AKfycbyQPbM1TQd-QtHBNH81kLssxaPX2QIkAyDeaasvnXBVQTU3r5v9z5K828NbtJoiNCA/exec";

const payload = {
  date: "12/06/2026",
  orderId: "NQ-REDIRECT-TEST",
  country: "السعودية",
  name: "Redirect Test",
  phone: "966512345678",
  product: "test",
  sku: "NQ-RAD-001",
  quantity: "1",
  totalPrice: 199,
  currency: "SAR",
  status: "جديد",
};

async function followRedirects(method) {
  let currentUrl = url;
  for (let i = 0; i < 5; i++) {
    const res = await fetch(currentUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method === "POST" ? JSON.stringify(payload) : undefined,
      redirect: "manual",
    });
    console.log(`step ${i}`, method, res.status, res.headers.get("location")?.slice(0, 80));
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) break;
      currentUrl = loc;
      continue;
    }
    const body = await res.text();
    console.log("final body", body.slice(0, 200));
    return;
  }
}

await followRedirects("POST");
