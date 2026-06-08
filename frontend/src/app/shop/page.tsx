import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { products } from "@/lib/products";
import type { Product } from "@/lib/products";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "تسوقي | نقاء للتجميل الفاخر",
  description:
    "تصفحي مجموعة نقاء الكاملة — 5 منتجات متخصصة بمكونات فعّالة بتركيزات حقيقية. توصيل مجاني لجميع دول الخليج.",
};

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group rounded-2xl border border-glass-border hover:border-gold/15 bg-obsidian-surface transition-all duration-700 overflow-hidden flex flex-col shine-sweep hover:shadow-[0_8px_60px_rgba(212,168,83,0.08)]">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden block">
        <span className="absolute top-4 right-4 z-10 glass-strong text-gold text-[10px] font-semibold px-3 py-1.5 rounded-full border border-gold/10">
          {product.badge}
        </span>
        <Image
          src={product.image} alt={product.name} fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.06] transition-transform duration-[900ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-surface via-obsidian/20 to-transparent" />
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`}>
          <h2 className="text-[16px] font-bold text-text-primary mb-1 group-hover:text-gold transition-colors duration-500">
            {product.name}
          </h2>
        </Link>
        <p className="text-[13px] text-text-muted mb-3">{product.subtitle}</p>
        <p className="text-[13px] text-text-muted/70 mb-5 leading-relaxed flex-1">{product.description}</p>

        <div className="mb-5">
          <div className="flex flex-wrap gap-1.5">
            {product.ingredients.map((ing) => (
              <span key={ing.name} className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-white/[0.03] text-text-muted border border-glass-border">
                {ing.name}
                {ing.concentration && <span className="font-bold text-gold">{ing.concentration}</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-glass-border">
          <Link href={`/products/${product.slug}`} className="text-[12px] text-gold/70 font-medium hover:text-gold transition-colors">
            التفاصيل
          </Link>
          <AddToCartButton productId={product.id} label="أضف للسلة" className="text-[12px] px-4 py-2" />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Header />

      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.015] blur-[200px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-bold text-text-primary mb-4">
            مجموعة نقاء <span className="text-gradient">الكاملة</span>
          </h1>
          <p className="text-[15px] text-text-muted max-w-lg mx-auto leading-relaxed">
            5 منتجات متخصصة — كل منتج يحل مشكلة مختلفة تماماً
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 border-t border-glass-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {["توصيل مجاني لجميع دول الخليج", "الدفع عند الاستلام", "مكونات فعّالة بتركيزات حقيقية"].map((text) => (
              <div key={text} className="flex items-center justify-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gold/40" />
                <p className="text-[12px] text-text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
