import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { products, getProductBySlug, getCrossSells } from "@/lib/products";
import type { Product } from "@/lib/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "منتج غير موجود" };

  return {
    title: `${product.name} | نقاء للتجميل الفاخر`,
    description: product.longDescription,
  };
}

function CrossSellCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-brand-white rounded-xl border border-brand-beige-dark hover:border-brand-gold/40 transition-all overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-brand-black group-hover:text-brand-gold transition-colors mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-brand-gray mb-3">{product.subtitle}</p>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-brand-black">
            {product.price}{" "}
            <span className="text-xs text-brand-gray font-normal">ر.س</span>
          </span>
          <span className="text-xs text-brand-gold font-semibold">
            عرض المنتج
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const crossSells = getCrossSells(slug);

  return (
    <>
      <Header />

      <section className="bg-brand-white py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Product image area */}
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <span
                className={`absolute top-5 right-5 z-10 text-xs font-semibold px-3 py-1.5 rounded-full ${product.badgeBg}`}
              >
                {product.badge}
              </span>
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              <p className="text-sm text-brand-gold font-medium mb-2">
                {product.subtitle}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5 text-brand-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-sm text-brand-gray">(247 تقييم)</span>
              </div>

              <p className="text-brand-black/70 leading-relaxed mb-6">
                {product.longDescription}
              </p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-brand-black">
                  {product.price}
                </span>
                <span className="text-lg text-brand-gray">ر.س</span>
                <span className="text-sm text-brand-gray mr-2">
                  شامل التوصيل المجاني
                </span>
              </div>

              <AddToCartButton
                productId={product.id}
                showPrice
                label="أضف للسلة"
                variant="accent"
                accentBg={product.accentBg}
                className="w-full text-lg py-4 mb-4"
              />

              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="text-center p-3 rounded-lg bg-brand-beige/50 border border-brand-beige-dark">
                  <span className="text-brand-gold text-sm block mb-1">✓</span>
                  <span className="text-xs text-brand-black font-medium">
                    توصيل مجاني
                  </span>
                </div>
                <div className="text-center p-3 rounded-lg bg-brand-beige/50 border border-brand-beige-dark">
                  <span className="text-brand-gold text-sm block mb-1">✓</span>
                  <span className="text-xs text-brand-black font-medium">
                    الدفع عند الاستلام
                  </span>
                </div>
                <div className="text-center p-3 rounded-lg bg-brand-beige/50 border border-brand-beige-dark">
                  <span className="text-brand-gold text-sm block mb-1">✓</span>
                  <span className="text-xs text-brand-black font-medium">
                    ضمان الرضا
                  </span>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h2 className="text-base font-bold text-brand-black mb-3">
                  المكونات الرئيسية
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {product.ingredients.map((ing) => (
                    <div
                      key={ing.name}
                      className="flex items-center gap-2 p-3 rounded-lg bg-brand-beige/50 border border-brand-beige-dark"
                    >
                      <span className="text-brand-gold">●</span>
                      <span className="text-sm text-brand-black">
                        {ing.name}
                        {ing.concentration && (
                          <span
                            className={`font-bold mr-1 ${product.accentColor}`}
                          >
                            {ing.concentration}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free from */}
              <div className="flex flex-wrap gap-2">
                {product.freeFrom.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-100"
                  >
                    0% {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to use & Format */}
      <section className="bg-brand-beige/40 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-brand-white p-8 rounded-2xl border border-brand-beige-dark">
              <h2 className="text-xl font-bold text-brand-black mb-6">
                كيفية الاستخدام
              </h2>
              <ol className="space-y-4">
                {product.howToUse.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full ${product.accentBg} text-white text-sm font-bold flex items-center justify-center`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-brand-black/80 leading-relaxed pt-1">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-brand-white p-8 rounded-2xl border border-brand-beige-dark">
              <h2 className="text-xl font-bold text-brand-black mb-6">
                تفاصيل المنتج
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-brand-beige">
                  <span className="text-sm text-brand-gray">الشكل</span>
                  <span className="text-sm font-medium text-brand-black">
                    {product.format}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-brand-beige">
                  <span className="text-sm text-brand-gray">السعر</span>
                  <span className="text-sm font-medium text-brand-black">
                    {product.price} ر.س (شامل التوصيل)
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-brand-beige">
                  <span className="text-sm text-brand-gray">التوصيل</span>
                  <span className="text-sm font-medium text-brand-black">
                    مجاني — 2-5 أيام عمل
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-brand-gray">الدفع</span>
                  <span className="text-sm font-medium text-brand-black">
                    عند الاستلام (COD)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-sells */}
      <section className="bg-brand-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-brand-black mb-8 text-center">
            منتجات قد تعجبك
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {crossSells.map((p) => (
              <CrossSellCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Sticky CTA (mobile) */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-brand-white/95 backdrop-blur-md border-t border-brand-beige-dark p-4 md:hidden">
        <AddToCartButton
          productId={product.id}
          showPrice
          label="أضف للسلة"
          variant="accent"
          accentBg={product.accentBg}
          className="w-full text-base py-3.5"
        />
      </div>

      <Footer />
    </>
  );
}
