import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhyNaqaSection from "@/components/WhyNaqaSection";
import Reveal from "@/components/Reveal";
import { products } from "@/lib/products";

const testimonials = [
  {
    name: "سارة م.",
    city: "الرياض",
    text: "من أول أسبوع لاحظت فرق في توحد لون بشرتي. أخيراً منتج يشتغل فعلاً.",
  },
  {
    name: "نورة ع.",
    city: "جدة",
    text: "النضارة واضحة والجفاف اختفى. العبوة فخمة والنتيجة أ فخم.",
  },
  {
    name: "فهد ك.",
    city: "دبي",
    text: "سيروم الشعر كان مختلف — شعري بدأ يتكاثف من الشهر الثاني.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-gradient-to-b from-brand-beige to-brand-white pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="inline-flex items-center gap-3 text-brand-gray text-xs md:text-sm tracking-[0.15em] mb-8">
              <span className="w-6 h-px bg-brand-gold" aria-hidden />
              تركيبات علمية – مكونات فعالة – تركيزات حقيقية
              <span className="w-6 h-px bg-brand-gold" aria-hidden />
            </p>
            <h1 className="font-display text-[clamp(2.75rem,7.5vw,5rem)] font-bold text-brand-black leading-[1.12]">
              لأن بشرتك
            </h1>
            <p className="font-display text-[clamp(2.75rem,7.5vw,5rem)] font-bold text-brand-gold leading-[1.12] mt-1 mb-10">
              تستحق الأنقى
            </p>
            <p className="text-brand-gray text-base md:text-lg max-w-2xl mx-auto leading-[1.9] mb-11">
              5 منتجات premium تحل مشاكل حقيقية — تصبغات، جفاف، تساقط الشعر،
              هالات، وحب الشباب. توصيل مجاني ودفع عند الاستلام.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-brand-black text-brand-white text-sm font-semibold tracking-wide px-10 py-4 rounded-full transition-all duration-300 hover:bg-brand-gold hover:shadow-[var(--shadow-luxe)] active:scale-[0.98]"
              >
                تسوقي المجموعة
              </Link>
              <Link
                href="#products"
                className="inline-flex items-center justify-center text-sm font-semibold tracking-wide text-brand-black border border-brand-black/15 px-10 py-4 rounded-full transition-all duration-300 hover:border-brand-gold hover:text-brand-gold-dark active:scale-[0.98]"
              >
                تصفحي المنتجات
              </Link>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="bg-brand-black text-brand-white/90 py-5">
          <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm tracking-wide">
            <span>+2,347 عميلة</span>
            <span className="text-brand-gold/30" aria-hidden>|</span>
            <span className="text-brand-gold">★★★★★ 4.9/5</span>
            <span className="text-brand-gold/30" aria-hidden>|</span>
            <span>5 منتجات</span>
            <span className="text-brand-gold/30" aria-hidden>|</span>
            <span>6 دول خليجية</span>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="py-20 md:py-32 bg-brand-white">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-14 md:mb-20">
              <p className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
                المجموعة
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-black mb-5">
                مجموعة نقاء
              </h2>
              <p className="text-brand-gray text-base max-w-xl mx-auto leading-relaxed">
                5 منتجات — 5 حلول. كل منتج يستهدف مشكلة محددة.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
              {products.map((product, i) => (
                <Reveal key={product.id} delay={Math.min(i, 3) * 0.08}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Reveal>
          <WhyNaqaSection />
        </Reveal>

        {/* Testimonials */}
        <section className="py-20 md:py-32 bg-brand-white">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-14 md:mb-16">
              <p className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
                آراء موثوقة
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-black">
                آراء عميلاتنا
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08}>
                  <blockquote className="h-full flex flex-col bg-brand-beige rounded-2xl border border-brand-beige-dark p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-[var(--shadow-luxe-lg)]">
                    <div className="text-brand-gold text-sm tracking-widest mb-4" aria-hidden>★★★★★</div>
                    <p className="text-brand-black/80 text-[15px] leading-[1.9] mb-6 flex-1">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <footer className="pt-4 border-t border-brand-beige-dark">
                      <p className="font-semibold text-brand-black text-sm">{t.name}</p>
                      <p className="text-brand-gray text-xs mt-0.5">{t.city}</p>
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32 bg-brand-beige border-t border-brand-beige-dark">
          <Reveal className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-black mb-5">
              ابدئي رحلتك مع نقاء
            </h2>
            <p className="text-brand-gray text-base mb-9 leading-relaxed">
              طلبك يصلك لباب البيت — تدفعين عند الاستلام فقط.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-brand-black text-brand-white text-sm font-semibold tracking-wide px-12 py-4 rounded-full transition-all duration-300 hover:bg-brand-gold hover:shadow-[var(--shadow-luxe)] active:scale-[0.98]"
            >
              تسوقي الآن
            </Link>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
