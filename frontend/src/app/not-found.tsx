import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LogoMark from "@/components/LogoMark";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة | نقاء للتجميل الفاخر",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="main-content"
        className="bg-brand-beige min-h-[60vh] flex items-center justify-center py-24 px-6"
      >
        <div className="text-center max-w-md">
          <LogoMark className="h-10 w-14 mx-auto mb-8 text-brand-gold" />
          <p className="font-display text-6xl md:text-7xl font-bold text-brand-black leading-none mb-4">
            404
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-brand-black mb-3">
            الصفحة غير موجودة
          </h1>
          <p className="text-brand-gray leading-relaxed mb-9">
            يبدو أن الصفحة التي تبحثين عنها غير متاحة. عودي إلى المتجر لاكتشاف
            مجموعة نقاء.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-brand-black text-brand-white text-sm font-semibold tracking-wide px-9 py-3.5 rounded-full transition-all duration-300 hover:bg-brand-gold active:scale-[0.98]"
            >
              تسوقي المجموعة
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center text-sm font-semibold tracking-wide text-brand-black border border-brand-black/15 px-9 py-3.5 rounded-full transition-all duration-300 hover:border-brand-gold hover:text-brand-gold-dark active:scale-[0.98]"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
