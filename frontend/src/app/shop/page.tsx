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

      <section className="bg-brand-beige pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
            مجموعة نقاء الكاملة
          </h1>
          <p className="text-brand-gray max-w-lg mx-auto">
            5 منتجات متخصصة — كل منتج يحل مشكلة مختلفة تماماً
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-brand-beige border-t border-brand-beige-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-3">
              باقات نقاء الحصرية
            </h2>
            <p className="text-brand-gray max-w-lg mx-auto">
              مجموعات متكاملة — وفّري أكثر واختاري الحل الشامل لمشكلتك
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-brand-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 border-t border-brand-beige-dark bg-brand-beige">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-brand-gray">
            <p>✓ توصيل مجاني لجميع دول الخليج</p>
            <p>✓ الدفع عند الاستلام</p>
            <p>✓ مكونات فعّالة بتركيزات حقيقية</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
