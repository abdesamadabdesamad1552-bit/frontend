import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { products, getProductBySlug, getCrossSells } from "@/lib/products";
import type { Product } from "@/lib/products";
import { Star, Truck, CreditCard, ShieldCheck } from "lucide-react";

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
      <div className="p-4 min-w-0">
        <h3 className="text-sm font-semibold text-brand-black group-hover:text-brand-gold transition-colors mb-1 break-words">
          {product.name}
        </h3>
        <p className="text-xs text-brand-gray mb-2 break-words">{product.subtitle}</p>
        <span className="text-xs text-brand-gold font-medium">عرض المنتج</span>
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

      <section className="pt-8 pb-10 md:pt-12 md:pb-16 bg-brand-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-brand-beige-dark">
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

            <div className="flex flex-col min-w-0">
              <p className="text-sm text-brand-gold font-medium mb-2 break-words">{product.subtitle}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-brand-black mb-3 break-words">
                {product.name}
              </h1>

              <p className="text-base font-semibold text-brand-black/90 leading-relaxed mb-4 border-r-4 border-brand-gold pr-4 break-words">
                {product.hook}
              </p>

              <div className="inline-flex items-center gap-2 bg-brand-beige border border-brand-beige-dark rounded-full px-4 py-2 mb-5">
                <span className="text-xs text-brand-gray">المكون البطل</span>
                <span className="text-xs font-bold text-brand-black" dir="ltr">
                  {product.heroIngredient}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <span className="text-xs text-brand-gray">(247 تقييم)</span>
              </div>

              <p className="text-sm text-brand-black/80 leading-relaxed mb-7 break-words">
                {product.longDescription}
              </p>

              <AddToCartButton
                productId={product.id}
                showPrice
                label="أضف للسلة"
                variant="accent"
                accentBg={product.accentBg}
                className="w-full text-base py-4 mb-5"
              />

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: Truck, text: "توصيل مجاني" },
                  { icon: CreditCard, text: "الدفع عند الاستلام" },
                  { icon: ShieldCheck, text: "ضمان الرضا" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="text-center p-3 rounded-lg bg-brand-beige border border-brand-beige-dark"
                  >
                    <Icon className="w-4 h-4 text-brand-gold mx-auto mb-1.5" strokeWidth={1.5} />
                    <span className="text-[10px] text-brand-gray">{text}</span>
                  </div>
                ))}
              </div>

              <div className="mb-7">
                <h2 className="text-sm font-bold text-brand-black mb-3">المكونات الرئيسية</h2>
                <div className="grid grid-cols-2 gap-2">
                  {product.ingredients.map((ing) => (
                    <div
                      key={ing.name}
                      className="flex items-center gap-2 p-3 rounded-lg bg-brand-beige border border-brand-beige-dark"
                    >
                      <span className="text-xs text-brand-black">
                        {ing.name}
                        {ing.concentration && (
                          <span className={`font-bold ${product.accentColor} mr-1`}>
                            {ing.concentration}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.freeFrom.map((item) => (
                  <span
                    key={item}
                    className="text-[10px] px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100"
                  >
                    0% {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-brand-beige border-t border-brand-beige-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-white p-8 rounded-2xl border border-brand-beige-dark">
              <h2 className="text-base font-bold text-brand-black mb-6">كيفية الاستخدام</h2>
              <ol className="space-y-4">
                {product.howToUse.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-gold text-brand-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm text-brand-gray leading-relaxed pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-brand-white p-8 rounded-2xl border border-brand-beige-dark">
              <h2 className="text-base font-bold text-brand-black mb-6">تفاصيل المنتج</h2>
              <div className="space-y-0">
                {[
                  { label: "الشكل", value: product.format },
                  { label: "التوصيل", value: "مجاني — 2-5 أيام عمل" },
                  { label: "الدفع", value: "عند الاستلام (COD)" },
                ].map((d, i, arr) => (
                  <div
                    key={d.label}
                    className={`flex justify-between items-center py-3.5 ${
                      i < arr.length - 1 ? "border-b border-brand-beige-dark" : ""
                    }`}
                  >
                    <span className="text-xs text-brand-gray">{d.label}</span>
                    <span className="text-xs font-medium text-brand-black">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-brand-white border-t border-brand-beige-dark">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-lg font-bold text-brand-black mb-8 text-center">
            منتجات قد تعجبك
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 min-w-0">
            {crossSells.map((p) => (
              <CrossSellCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

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
