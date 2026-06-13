import fs from "fs";

const src = fs.readFileSync("frontend/src/lib/products.ts", "utf8");

const data = [
  {
    sku: "NQ-RAD-001",
    en: "Naqa Radiance Serum — Vitamin C Brightening Serum",
    hero: "Ethyl Ascorbic Acid + Alpha-Arbutin",
    ingredients: "Vit C 10% | Niacinamide 5% | Alpha-Arbutin 2% | HA",
    format: "Serum 30ml glass dropper",
    link: "https://www.alibaba.com/product-detail/OEM-Vitamin-C-Face-Serum-50ml_1601733518322.html",
    match: "94%",
    price: "$0.54 USD",
    moq: "1000 pcs",
  },
  {
    sku: "NQ-MSK-002",
    en: "Naqa Golden Glow Mask — Copper Peptide Night Cream",
    hero: "GHK-Cu Copper Peptide + Multi-Weight HA",
    ingredients: "Copper Peptide | HA 3 weights | Snail | Centella",
    format: "Overnight jar 50g",
    link: "https://www.alibaba.com/product-detail/OEM-Face-Cream-GHK-CU-Copper_1601403534850.html",
    match: "91%",
    price: "$1.62–1.75 USD",
    moq: "200 pcs",
  },
  {
    sku: "NQ-HRS-003",
    en: "Naqa Hair Density Serum — Redensyl 3% Scalp Treatment",
    hero: "Redensyl 3% + AnaGain",
    ingredients: "Redensyl 3% | Caffeine 2% | Biotin | Zinc PCA",
    format: "Serum 30ml needle dropper",
    link: "https://www.alibaba.com/product-detail/Private-Label-Redensyl-3-Hair-Growth_1601709360545.html",
    match: "96%",
    price: "$2.15 USD",
    moq: "500 pcs",
  },
  {
    sku: "NQ-EYE-004",
    en: "Naqa Retinol Eye Cream — Caffeine Eye Roller",
    hero: "Retinaldehyde 0.05% + Caffeine 3%",
    ingredients: "Retinaldehyde | Caffeine 3% | Haloxyl 2% | Eyeseryl",
    format: "Tube 15ml metal roller",
    link: "https://www.alibaba.com/product-detail/Cooling-Caffeine-Eye-Serum-Roller-for_1601725461863.html",
    match: "91%",
    price: "$0.85–0.93 USD",
    moq: "500 pcs",
  },
  {
    sku: "NQ-CLR-005",
    en: "Naqa Clarity Gel — BHA Salicylic Clarifying Gel",
    hero: "Salicylic Acid 2% + Niacinamide 4%",
    ingredients: "Salicylic 2% | Niacinamide 4% | Zinc PCA 1% | Tea Tree",
    format: "Clear gel pump 30ml",
    link: "https://www.alibaba.com/product-detail/LANBENA-Skin-Anti-Acne-Serum-with_1601195297445.html",
    match: "93%",
    price: "$2.26 USD",
    moq: "10 pcs",
  },
];

function arabicName(sku) {
  const m = src.match(new RegExp(`sku: "${sku}"[\\s\\S]*?name: "([^"]+)"`));
  return m?.[1] ?? "";
}

const header = [
  "SKU",
  "Product Name (EN)",
  "Product Name (AR)",
  "Hero Ingredient",
  "Key Ingredients",
  "Format",
  "Alibaba Link",
  "Match %",
  "Sourcing Price",
  "MOQ",
  "Selling Price",
];

const esc = (v) => (/[",]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

const rows = [
  header,
  ...data.map((p) => [
    p.sku,
    p.en,
    arabicName(p.sku),
    p.hero,
    p.ingredients,
    p.format,
    p.link,
    p.match,
    p.price,
    p.moq,
    "199 SAR",
  ]),
];

const csv = "\uFEFF" + rows.map((r) => r.map(esc).join(",")).join("\n") + "\n";
fs.writeFileSync("naqa-products-sourcing.csv", csv, "utf8");
console.log("Created naqa-products-sourcing.csv");
