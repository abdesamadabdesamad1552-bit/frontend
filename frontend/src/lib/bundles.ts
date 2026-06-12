export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  productIds: number[];
  badge: string;
}

export const bundles: Bundle[] = [
  {
    id: "glow-complete",
    name: "مجموعة الإشراق الكامل",
    tagline: "سيروم فيتامين C + قناع النضارة + كريم العيون — بشرة موحّدة ومشرقة",
    productIds: [1, 2, 4],
    badge: "الأكثر طلباً",
  },
  {
    id: "full-transform",
    name: "مجموعة التحول الشامل",
    tagline: "الـ 5 منتجات — روتين نقاء الكامل من الرأس للقدم",
    productIds: [1, 2, 3, 4, 5],
    badge: "أفضل قيمة",
  },
  {
    id: "event-ready",
    name: "مجموعة ما قبل المناسبات",
    tagline: "قناع النضارة + جل الصفاء + سيروم الإشراق — نتائج تبان في 48 ساعة",
    productIds: [2, 5, 1],
    badge: "نتائج فورية",
  },
];

export function getBundle(id: string): Bundle | undefined {
  return bundles.find((b) => b.id === id);
}
