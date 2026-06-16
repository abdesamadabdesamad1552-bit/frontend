import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تم استلام طلبك | نقاء للتجميل الفاخر",
  description:
    "تم استلام طلبك. انتظر اتصالنا خلال 10 دقائق لتأكيد العنوان — الدفع عند الاستلام وشحن مجاني.",
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
