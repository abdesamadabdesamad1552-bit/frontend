import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تم استلام طلبك | نقاء للتجميل الفاخر",
  description: "شكراً لثقتك بنا. تم استلام طلبك وسنتواصل معك قريباً لتأكيد التوصيل.",
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
