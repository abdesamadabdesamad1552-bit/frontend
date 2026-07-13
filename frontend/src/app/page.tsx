import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhyNaqaSection from "@/components/WhyNaqaSection";
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

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-brand-beige via-brand-white to-brand-white pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-brand-gray text-sm md:text-base mb-8 leading-relaxed">
              تركيبات علمية – مكونات فعالة – تركيزات حقيقية
            </p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-bold text-brand-black leading-[1.15]">
              لأن بشرتك
            </h1>
            <p className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-bold text-brand-gold leading-[1.15] mt-1 mb-10">
              تستحق الأنقى
            </p>
            <p className="text-brand-gray text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              5 منتجات premium تحل مشاكل حقيقية — تصبغات، جفاف، تساقط الشعر،
              هالات، وحب الشباب. توصيل مجاني ودفع عند الاستلام.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-brand-black text-brand-white text-base font-semibold px-8 py-4 rounded-xl hover:bg-brand-gold transition-colors"
              >
                تسوقي المجموعة
              </Link>
              <Link
                href="#products"
                className="inline-flex items-center justify-center text-base font-medium text-brand-gold border border-brand-gold/30 px-8 py-4 rounded-xl hover:bg-brand-beige transition-colors"
              >
                تصفحي المنتجات
              </Link>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="bg-brand-black text-brand-white py-5">
          <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm">
            <span>+2,347 عميلة</span>
            <span>★★★★★ 4.9/5</span>
            <span>5 منتجات</span>
            <span>6 دول خليجية</span>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="py-16 md:py-24 bg-brand-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-black mb-4">
                مجموعة نقاء
              </h2>
              <p className="text-brand-gray max-w-xl mx-auto">
                5 منتجات — 5 حلول. كل منتج يستهدف مشكلة محددة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <WhyNaqaSection />

        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-brand-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-black text-center mb-12">
              آراء عميلاتنا
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <blockquote
                  key={t.name}
                  className="bg-brand-beige rounded-2xl border border-brand-beige-dark p-6"
                >
                  <p className="text-brand-black/80 text-sm leading-relaxed mb-5">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <footer>
                    <p className="font-semibold text-brand-black text-sm">{t.name}</p>
                    <p className="text-brand-gray text-xs">{t.city}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-brand-beige">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-black mb-4">
              ابدئي رحلتك مع نقاء
            </h2>
            <p className="text-brand-gray mb-8 leading-relaxed">
              طلبك يصلك لباب البيت — تدفعين عند الاستلام فقط.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-brand-black text-brand-white text-base font-semibold px-10 py-4 rounded-xl hover:bg-brand-gold transition-colors"
            >
              تسوقي الآن
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
