import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import BundleCard from "@/components/BundleCard";
import { products } from "@/lib/products";
import { bundles } from "@/lib/bundles";

export const metadata: Metadata = {
  title: "تسوقي | نقاء للتجميل الفاخر",
  description:
    "تصفحي مجموعة نقاء الكاملة — 5 منتجات متخصصة بمكونات فعّالة بتركيزات حقيقية. توصيل مجاني لجميع دول الخليج.",
};

export default function ShopPage() {
  return (
    <>
      <Header />

      <main id="main-content" className="contents">
      <section className="bg-brand-beige pt-16 pb-12 md:pt-20 md:pb-16 border-b border-brand-beige-dark">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            المتجر
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-black mb-5">
            مجموعة نقاء الكاملة
          </h1>
          <p className="text-brand-gray text-base max-w-lg mx-auto leading-relaxed">
            5 منتجات متخصصة — كل منتج يحل مشكلة مختلفة تماماً
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-brand-beige">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-brand-black mb-4">
              باقات نقاء الحصرية
            </h2>
            <p className="text-brand-gray max-w-lg mx-auto leading-relaxed">
              مجموعات متكاملة — وفّري أكثر واختاري الحل الشامل لمشكلتك
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-brand-white border-t border-brand-beige-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 min-w-0">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 border-t border-brand-beige-dark bg-brand-beige">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm text-brand-gray">
            <p className="flex items-center justify-center gap-2"><span className="text-brand-gold" aria-hidden>✓</span> توصيل مجاني لجميع دول الخليج</p>
            <p className="flex items-center justify-center gap-2"><span className="text-brand-gold" aria-hidden>✓</span> الدفع عند الاستلام</p>
            <p className="flex items-center justify-center gap-2"><span className="text-brand-gold" aria-hidden>✓</span> مكونات فعّالة بتركيزات حقيقية</p>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}
