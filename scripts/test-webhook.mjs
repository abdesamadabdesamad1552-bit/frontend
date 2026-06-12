const url =
  "https://script.google.com/macros/s/AKfycbyQPbM1TQd-QtHBNH81kLssxaPX2QIkAyDeaasvnXBVQTU3r5v9z5K828NbtJoiNCA/exec";

async function testGet() {
  const res = await fetch(url, { redirect: "follow" });
  const body = await res.text();
  console.log("GET", res.status, body.slice(0, 120));
}

async function testPost() {
  const payload = {
    date: "12/06/2026",
    orderId: "NQ-VERIFY1",
    country: "السعودية",
    name: "Test Verify",
    phone: "966512345678",
    product: "test",
    sku: "NQ-RAD-001",
    quantity: "1",
    totalPrice: 199,
    currency: "SAR",
    status: "جديد",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });
  const body = await res.text();
  console.log("POST", res.status, body.slice(0, 200));
}

await testGet();
await testPost();
