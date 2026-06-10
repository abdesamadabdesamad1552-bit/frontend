import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "تسوقي | نقاء للتجميل الفاخر",
  description:
    "تصفحي مجموعة نقاء الكاملة — 5 منتجات متخصصة بمكونات فعّالة. توصيل مجاني لجميع دول الخليج.",
};

export default function ShopPage() {
  return (
    <>
      <Header />

      <section className="border-b border-white/[0.06] pt-32 pb-14 md:pt-40 md:pb-16">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gold/60">Naqa Beauty</p>
          <h1 className="mb-4 text-[clamp(1.75rem,5vw,3rem)] font-bold text-white">
            مجموعة نقاء الكاملة
          </h1>
          <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-white/50">
            5 منتجات premium — كل واحد يحل مشكلة مختلفة. الدفع عند الاستلام.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-10">
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-8 px-6">
          {["توصيل مجاني لجميع دول الخليج", "الدفع عند الاستلام", "مكونات فعّالة بتركيزات حقيقية"].map(
            (text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gold/50" />
                <p className="text-[13px] text-white/45">{text}</p>
              </div>
            )
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
