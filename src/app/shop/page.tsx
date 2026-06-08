import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { products } from "@/lib/products";
import type { Product } from "@/lib/products";

export const metadata: Metadata = {
  title: "تسوقي | نقاء للتجميل الفاخر",
  description:
    "تصفحي مجموعة نقاء الكاملة — 5 منتجات متخصصة بمكونات فعّالة بتركيزات حقيقية. توصيل مجاني لجميع دول الخليج.",
};

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-brand-white rounded-2xl border border-brand-beige-dark hover:border-brand-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/5 overflow-hidden flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden block"
      >
        <span
          className={`absolute top-4 right-4 z-10 text-xs font-semibold px-3 py-1 rounded-full ${product.badgeBg}`}
        >
          {product.badge}
        </span>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${product.gradient} opacity-30`} />
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`}>
          <h2 className="text-lg font-bold text-brand-black mb-1 group-hover:text-brand-gold transition-colors">
            {product.name}
          </h2>
        </Link>
        <p className="text-sm text-brand-gray mb-3">{product.subtitle}</p>
        <p className="text-sm text-brand-black/70 mb-4 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {product.ingredients.map((ing) => (
              <span
                key={ing.name}
                className="inline-flex items-center gap-1 text-xs bg-brand-beige text-brand-black/80 px-2.5 py-1 rounded-full"
              >
                {ing.name}
                {ing.concentration && (
                  <span className={`font-bold ${product.accentColor}`}>
                    {ing.concentration}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-brand-beige">
          <Link
            href={`/products/${product.slug}`}
            className="text-xs text-brand-gold font-semibold hover:underline"
          >
            التفاصيل ←
          </Link>
          <AddToCartButton
            productId={product.id}
            label="أضف للسلة"
            variant="accent"
            accentBg={product.accentBg}
            className="text-sm px-5 py-2.5"
          />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Header />

      <section className="bg-brand-beige py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-brand-black mb-4">
            مجموعة نقاء الكاملة
          </h1>
          <p className="text-brand-gray max-w-2xl mx-auto text-lg">
            5 منتجات — كل منتج يحل مشكلة مختلفة تماماً. تركيبات علمية بمكونات
            فعّالة بتركيزات حقيقية — مصممة لمناخ الخليج.
          </p>
        </div>
      </section>

      <section className="bg-brand-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-beige/50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <span className="text-brand-gold text-2xl block mb-2">✓</span>
              <p className="text-sm font-medium text-brand-black">
                توصيل مجاني لجميع دول الخليج
              </p>
            </div>
            <div>
              <span className="text-brand-gold text-2xl block mb-2">✓</span>
              <p className="text-sm font-medium text-brand-black">
                الدفع عند الاستلام
              </p>
            </div>
            <div>
              <span className="text-brand-gold text-2xl block mb-2">✓</span>
              <p className="text-sm font-medium text-brand-black">
                مكونات فعّالة بتركيزات حقيقية
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
