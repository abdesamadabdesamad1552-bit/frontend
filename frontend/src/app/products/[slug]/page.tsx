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
  return { title: `${product.name} | نقاء للتجميل الفاخر`, description: product.longDescription };
}

function CrossSellCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-xl bg-obsidian-surface border border-glass-border hover:border-gold/10 transition-all duration-500 overflow-hidden flex flex-col shine-sweep"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-surface/70 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-[13px] font-semibold text-text-primary group-hover:text-gold transition-colors mb-1">{product.name}</h3>
        <p className="text-[11px] text-text-faint mb-3">{product.subtitle}</p>
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-gold">
            {product.price} <span className="text-[10px] text-text-faint font-normal">ر.س</span>
          </span>
          <span className="text-[10px] text-gold/60 font-medium">عرض المنتج</span>
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

      <section className="relative pt-28 pb-10 md:pt-36 md:pb-16">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-gold/[0.015] blur-[180px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-aurora-violet/[0.015] blur-[180px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-obsidian-surface border border-glass-border glow-gold">
              <span className="absolute top-5 right-5 z-10 glass-strong text-gold text-[10px] font-semibold px-3 py-1.5 rounded-full border border-gold/10">
                {product.badge}
              </span>
              <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/20 to-transparent" />
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <p className="text-[12px] text-gold/60 font-medium mb-2">{product.subtitle}</p>
              <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-text-primary mb-3">{product.name}</h1>

              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold/70 text-gold/70" />
                  ))}
                </div>
                <span className="text-[12px] text-text-faint">(247 تقييم)</span>
              </div>

              <p className="text-[14px] text-text-secondary leading-[1.8] mb-7">{product.longDescription}</p>

              <div className="flex items-baseline gap-2 mb-7">
                <span className="text-[36px] font-bold text-gold">{product.price}</span>
                <span className="text-[16px] text-text-faint">ر.س</span>
                <span className="text-[12px] text-text-faint mr-2">شامل التوصيل</span>
              </div>

              <AddToCartButton productId={product.id} showPrice label="أضف للسلة" className="w-full text-[15px] py-4 mb-5" />

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: Truck, text: "توصيل مجاني" },
                  { icon: CreditCard, text: "الدفع عند الاستلام" },
                  { icon: ShieldCheck, text: "ضمان الرضا" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="text-center p-3 rounded-lg bg-obsidian-elevated border border-glass-border">
                    <Icon className="w-3.5 h-3.5 text-gold/50 mx-auto mb-1.5" strokeWidth={1.5} />
                    <span className="text-[10px] text-text-muted">{text}</span>
                  </div>
                ))}
              </div>

              {/* Ingredients */}
              <div className="mb-7">
                <h2 className="text-[13px] font-bold text-text-primary mb-3">المكونات الرئيسية</h2>
                <div className="grid grid-cols-2 gap-2">
                  {product.ingredients.map((ing) => (
                    <div key={ing.name} className="flex items-center gap-2 p-3 rounded-lg bg-obsidian-elevated border border-glass-border">
                      <span className="w-1 h-1 rounded-full bg-gold/50" />
                      <span className="text-[12px] text-text-muted">
                        {ing.name}
                        {ing.concentration && <span className="font-bold text-gold mr-1">{ing.concentration}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free from */}
              <div className="flex flex-wrap gap-2">
                {product.freeFrom.map((item) => (
                  <span key={item} className="text-[10px] px-3 py-1.5 rounded-full bg-red-500/[0.05] text-red-400/80 border border-red-500/10">
                    0% {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="py-14 md:py-20 border-t border-glass-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-obsidian-surface p-8 rounded-2xl border border-glass-border">
              <h2 className="text-[16px] font-bold text-text-primary mb-6">كيفية الاستخدام</h2>
              <ol className="space-y-4">
                {product.howToUse.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold text-obsidian text-[12px] font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-[13px] text-text-muted leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-obsidian-surface p-8 rounded-2xl border border-glass-border">
              <h2 className="text-[16px] font-bold text-text-primary mb-6">تفاصيل المنتج</h2>
              <div className="space-y-0">
                {[
                  { label: "الشكل", value: product.format },
                  { label: "السعر", value: `${product.price} ر.س (شامل التوصيل)` },
                  { label: "التوصيل", value: "مجاني — 2-5 أيام عمل" },
                  { label: "الدفع", value: "عند الاستلام (COD)" },
                ].map((d, i, arr) => (
                  <div key={d.label} className={`flex justify-between items-center py-3.5 ${i < arr.length - 1 ? "border-b border-glass-border" : ""}`}>
                    <span className="text-[12px] text-text-faint">{d.label}</span>
                    <span className="text-[12px] font-medium text-text-primary">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-sells */}
      <section className="py-14 md:py-20 border-t border-glass-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-[18px] font-bold text-text-primary mb-8 text-center">منتجات قد تعجبك</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{crossSells.map((p) => <CrossSellCard key={p.id} product={p} />)}</div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-obsidian/90 backdrop-blur-2xl border-t border-glass-border p-4 md:hidden">
        <AddToCartButton productId={product.id} showPrice label="أضف للسلة" className="w-full text-[14px] py-3.5" />
      </div>

      <Footer />
    </>
  );
}
