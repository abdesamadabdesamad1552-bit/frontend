import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";
import { products, getProductBySlug, getCrossSells, getPrimaryImage, getFallbackImage } from "@/lib/products";
import type { Product } from "@/lib/products";
import { Star, Truck, CreditCard, ShieldCheck, Sparkles, Droplets, CheckCircle2, XCircle, ChevronDown } from "lucide-react";

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
    description: product.landing?.subheadline || product.longDescription,
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
          src={getPrimaryImage(product)}
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
  const landing = product.landing;

  // Fallback to old layout if no landing data (shouldn't happen since we added to all)
  if (!landing) {
    return (
      <>
        <Header />
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold">جاري التحديث...</h1>
        </div>
        <Footer />
      </>
    );
  }

  const iconMap: Record<string, React.ElementType> = {
    Droplets: Droplets,
    ShieldCheck: ShieldCheck,
    Sparkles: Sparkles,
  };

  return (
    <>
      <Header />

      {/* 1. Product Hero Section */}
      <section className="pt-8 pb-10 md:pt-12 md:pb-16 bg-brand-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <ProductGallery
              images={product.images}
              productName={product.name}
              fallbackSrc={getFallbackImage(product.slug)}
              badge={product.badge}
              badgeBg={product.badgeBg}
            />

            <div className="flex flex-col min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-brand-black mb-2 break-words">
                {product.name}
              </h1>
              <p className="text-base md:text-lg font-medium text-brand-gold mb-4 break-words">
                {landing.subheadline}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <span className="text-sm text-brand-gray">(+2000 تقييم)</span>
              </div>

              {/* 3 Emoji Bullet Benefits */}
              <div className="space-y-3 mb-8">
                {product.benefits.slice(0, 3).map((benefit, i) => {
                  const emojis = ["✨", "🛡️", "💧"];
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-lg">{emojis[i % emojis.length]}</span>
                      <p className="text-sm font-medium text-brand-black pt-0.5">{benefit.title}</p>
                    </div>
                  );
                })}
              </div>

              <AddToCartButton
                productId={product.id}
                showPrice
                label="أضف للسلة"
                variant="accent"
                accentBg={product.accentBg}
                className="w-full text-base py-4 mb-6 shadow-lg shadow-brand-gold/20"
              />

              {/* 3 Reviews Snippets */}
              <div className="space-y-3 bg-brand-beige/50 p-5 rounded-2xl border border-brand-beige-dark">
                {landing.reviews.map((review, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-black/90 italic mb-1">"{review.quote}"</p>
                      <p className="text-xs text-brand-gray font-medium">— {review.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Image with Text Section */}
      <section className="py-12 md:py-20 bg-brand-beige border-y border-brand-beige-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-4">
                {landing.imageWithText.headline}
              </h2>
              <p className="text-base text-brand-black/80 leading-relaxed">
                {landing.imageWithText.paragraph}
              </p>
            </div>
            <div className="order-1 md:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={product.images[1]?.src || product.image}
                alt={landing.imageWithText.headline}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why People Love Our Product */}
      <section className="py-16 md:py-24 bg-brand-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-black text-center mb-12">
            ليش عميلاتنا يحبون منتجاتنا؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {landing.threeColumns.map((col, i) => {
              const Icon = iconMap[col.icon] || Sparkles;
              return (
                <div key={i} className="text-center p-6 rounded-2xl bg-brand-beige border border-brand-beige-dark">
                  <div className="w-12 h-12 mx-auto bg-brand-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Icon className="w-6 h-6 text-brand-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-black mb-2">{col.title}</h3>
                  <p className="text-sm text-brand-gray leading-relaxed">{col.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How to Use + Comparison Table */}
      <section className="py-16 md:py-24 bg-brand-beige border-y border-brand-beige-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* How to Use */}
            <div>
              <h2 className="text-2xl font-bold text-brand-black mb-6">طريقة الاستخدام</h2>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-6">
                <Image
                  src={product.images[2]?.src || product.image}
                  alt="طريقة الاستخدام"
                  fill
                  className="object-cover"
                />
              </div>
              <ol className="space-y-4">
                {product.howToUse.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold text-brand-white text-sm font-bold flex items-center justify-center shadow-md">
                      {i + 1}
                    </span>
                    <span className="text-sm text-brand-black/90 leading-relaxed pt-1">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Comparison Table */}
            <div className="bg-brand-white p-6 md:p-8 rounded-3xl shadow-xl border border-brand-beige-dark">
              <h2 className="text-xl font-bold text-brand-black mb-2">
                {landing.comparison.title}
              </h2>
              <p className="text-sm text-brand-gray mb-8">
                {landing.comparison.subtitle}
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b-2 border-brand-beige-dark">
                      <th className="pb-4 font-bold text-brand-black w-1/2">الميزة</th>
                      <th className="pb-4 font-bold text-brand-gold text-center w-1/4">نقاء</th>
                      <th className="pb-4 font-bold text-brand-gray text-center w-1/4">الآخرين</th>
                    </tr>
                  </thead>
                  <tbody>
                    {landing.comparison.features.map((feature, i) => (
                      <tr key={i} className="border-b border-brand-beige-dark/50 last:border-0">
                        <td className="py-4 text-sm font-medium text-brand-black/90 pr-2">
                          {feature.name}
                        </td>
                        <td className="py-4 text-center">
                          {feature.us ? (
                            <CheckCircle2 className="w-5 h-5 text-brand-gold mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="py-4 text-center">
                          {feature.others ? (
                            <CheckCircle2 className="w-5 h-5 text-brand-gold mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-brand-gray/40 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trusted by Thousands */}
      <section className="py-16 md:py-24 bg-brand-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-brand-black mb-4">
            {landing.testimonials.headline}
          </h2>
          <p className="text-base text-brand-gray mb-12">
            {landing.testimonials.paragraph}
          </p>

          <div className="space-y-6">
            {landing.testimonials.stats.map((stat, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-brand-beige p-6 rounded-2xl border border-brand-beige-dark text-right">
                <div className="w-20 h-20 flex-shrink-0 bg-brand-gold rounded-full flex items-center justify-center text-brand-white text-2xl font-bold shadow-lg">
                  {stat.percent}
                </div>
                <p className="text-base md:text-lg text-brand-black/90 font-medium italic">
                  "{stat.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-16 md:py-24 bg-brand-beige border-t border-brand-beige-dark">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-black text-center mb-10">
            الأسئلة الشائعة
          </h2>
          <div className="space-y-4">
            {landing.faq.map((faq, i) => (
              <details key={i} className="group bg-brand-white rounded-2xl border border-brand-beige-dark overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-brand-black">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-brand-gold transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-sm text-brand-gray leading-relaxed border-t border-brand-beige-dark/50 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cross Sells */}
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
          className="w-full text-base py-3.5 shadow-lg"
        />
      </div>

      <Footer />
    </>
  );
}