import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhyNaqaSection from "@/components/WhyNaqaSection";
import Reveal from "@/components/Reveal";
import { products } from "@/lib/products";
import {
  Truck,
  CreditCard,
  FlaskConical,
  RotateCcw,
  Phone,
  Package,
  Sparkles,
} from "lucide-react";

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

const heroChips = [
  { icon: Truck, title: "توصيل مجاني", sub: "لكل دول الخليج" },
  { icon: CreditCard, title: "الدفع عند الاستلام", sub: "بلا التزام مسبق" },
  { icon: FlaskConical, title: "تركيزات معلنة", sub: "نسبة واضحة لكل مكوّن" },
  { icon: RotateCcw, title: "إرجاع خلال 7 أيام", sub: "بدون أسئلة" },
];

const steps = [
  {
    n: "١",
    icon: Package,
    title: "اطلبي أونلاين",
    desc: "اختاري منتجك واملئي بياناتك — دقيقة وحدة، بلا حساب ولا بطاقة.",
  },
  {
    n: "٢",
    icon: Phone,
    title: "نأكد بمكالمة",
    desc: "نتصل عليك نأكد الطلب والعنوان قبل الشحن.",
  },
  {
    n: "٣",
    icon: Sparkles,
    title: "استلمي وادفعي",
    desc: "يوصلك الطلب لباب البيت، وتدفعين نقدًا عند الاستلام فقط.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main id="main-content">
        {/* ===== Hero — positioning: مصمّمة لحرارة الخليج ===== */}
        <section className="bg-gradient-to-b from-brand-beige to-brand-white pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-12 md:gap-16 items-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 bg-brand-white border border-brand-beige-dark shadow-sm text-brand-black text-xs sm:text-[13px] font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" aria-hidden />
                مصمّمة لحرارة الخليج — مو منقولة من برّا
              </span>
              <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-bold text-brand-black leading-[1.15]">
                عناية تبقى فعّالة
                <span className="block text-brand-gold-dark">حتى في عزّ الصيف</span>
              </h1>
              <p className="text-brand-gray text-base md:text-lg leading-[1.9] mt-5 mb-8 max-w-xl">
                أكثر منتج بفيتامين سي يفقد فعاليته مع الحرارة والرطوبة. تركيبات نقاء
                مختارة لتبقى مستقرة في جو الخليج — بتركيزات معلنة لكل مكوّن، مو بس
                &ldquo;يحتوي على&rdquo;.
              </p>

              <div className="grid grid-cols-2 gap-3 max-w-lg mb-8">
                {heroChips.map(({ icon: Icon, title, sub }) => (
                  <div
                    key={title}
                    className="flex items-center gap-2.5 border border-brand-beige-dark bg-brand-white/70 rounded-xl px-3.5 py-3"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-brand-gold-dark" strokeWidth={2} />
                    <span className="leading-tight">
                      <span className="block text-[12.5px] font-semibold text-brand-black">{title}</span>
                      <span className="block text-[10.5px] text-brand-gray">{sub}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-brand-black text-brand-white text-sm font-semibold tracking-wide px-9 py-4 rounded-full transition-all duration-300 hover:bg-brand-gold active:scale-[0.98]"
                >
                  تسوّقي المجموعة
                  <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
                <Link
                  href="#why"
                  className="inline-flex items-center justify-center text-sm font-semibold tracking-wide text-brand-black border border-brand-black/15 px-9 py-4 rounded-full transition-all duration-300 hover:border-brand-gold hover:text-brand-gold-dark active:scale-[0.98]"
                >
                  شوفي المكوّنات
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="relative max-w-[440px] w-full mx-auto md:mx-0">
              <div className="relative aspect-[4/5] rounded-[26px] overflow-hidden bg-brand-beige shadow-[var(--shadow-luxe-lg)]">
                <Image
                  src="/images/radiance-serum/1-hero.webp"
                  alt="نقاء سيروم الإشراق"
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-5 -left-3 bg-brand-white rounded-2xl border border-brand-beige-dark shadow-[var(--shadow-luxe)] p-4 max-w-[224px]">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-brand-beige flex items-center justify-center shrink-0">
                    <FlaskConical className="w-5 h-5 text-brand-gold-dark" strokeWidth={2} />
                  </span>
                  <span className="leading-snug">
                    <span className="block text-[13px] font-bold text-brand-black">فيتامين سي 15%</span>
                    <span className="block text-[11px] text-brand-gray">Ethyl Ascorbic — ما يتأكسد بالحرارة</span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== Trust bar ===== */}
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

        {/* ===== Products ===== */}
        <section id="products" className="py-20 md:py-32 bg-brand-white">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-14 md:mb-20">
              <p className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
                OUR FORMULATIONS
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-black mb-5">
                مجموعة نقاء
              </h2>
              <p className="text-brand-gray text-base max-w-xl mx-auto leading-relaxed">
                كل منتج بتركيز معلن ومكوّن أساسي واحد يقود التركيبة — ومختار ليبقى ثابت في جو الخليج.
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

        {/* ===== Dark CTA band ===== */}
        <section className="bg-brand-black text-brand-white py-20 md:py-28 relative overflow-hidden">
          <div className="absolute -top-28 right-[-60px] w-72 h-72 rounded-full border border-brand-gold/15" aria-hidden />
          <div className="absolute -bottom-32 left-[-40px] w-64 h-64 rounded-full border border-brand-gold/10" aria-hidden />
          <Reveal className="relative max-w-2xl mx-auto px-6 text-center">
            <p className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              TRY IT RISK-FREE
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">جرّبيها بلا مخاطرة</h2>
            <p className="text-brand-white/75 text-base leading-relaxed mb-9 max-w-lg mx-auto">
              اطلبي اليوم وادفعي عند الاستلام — وإذا ما عجبك المنتج، رجّعيه خلال 7 أيام بدون أسئلة.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-brand-gold text-brand-white text-sm font-semibold tracking-wide px-12 py-4 rounded-full transition-all duration-300 hover:bg-brand-gold-light active:scale-[0.98]"
            >
              تسوّقي الآن
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 mt-10 text-[13px] text-brand-white/85">
              <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-brand-gold" strokeWidth={1.75} /> توصيل مجاني</span>
              <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-brand-gold" strokeWidth={1.75} /> الدفع عند الاستلام</span>
              <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4 text-brand-gold" strokeWidth={1.75} /> إرجاع سهل</span>
            </div>
          </Reveal>
        </section>

        {/* ===== Why Naqa (headline = positioning) ===== */}
        <Reveal>
          <WhyNaqaSection />
        </Reveal>

        {/* ===== How it works ===== */}
        <section className="py-20 md:py-32 bg-brand-white">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="text-center mb-14 md:mb-16">
              <p className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
                HOW IT WORKS
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-black mb-5">
                كيف توصلك طلبيتك
              </h2>
              <p className="text-brand-gray text-base max-w-xl mx-auto leading-relaxed">
                3 خطوات بسيطة، من الطلب لباب البيت.
              </p>
            </Reveal>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
              <div className="hidden md:block absolute top-7 right-[16%] left-[16%] h-px bg-gradient-to-l from-transparent via-brand-gold/40 to-transparent" aria-hidden />
              {steps.map(({ n, icon: Icon, title, desc }) => (
                <Reveal key={n} className="relative text-center">
                  <div className="w-14 h-14 rounded-full bg-brand-black border-[3px] border-brand-gold/60 text-brand-gold flex items-center justify-center text-xl font-bold mx-auto mb-5 shadow-[var(--shadow-luxe)]">
                    {n}
                  </div>
                  <h3 className="text-base font-bold text-brand-black mb-2 flex items-center justify-center gap-2">
                    <Icon className="w-4 h-4 text-brand-gold-dark" strokeWidth={2} />
                    {title}
                  </h3>
                  <p className="text-sm text-brand-gray leading-relaxed max-w-[250px] mx-auto">{desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Testimonials ===== */}
        <section className="py-20 md:py-32 bg-brand-beige border-y border-brand-beige-dark">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-14 md:mb-16">
              <p className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
                VERIFIED REVIEWS
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-black">
                آراء عميلاتنا
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08}>
                  <blockquote className="h-full flex flex-col bg-brand-white rounded-2xl border border-brand-beige-dark p-7 shadow-[var(--shadow-luxe)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-[var(--shadow-luxe-lg)]">
                    <div className="text-brand-gold text-sm tracking-widest mb-4" aria-hidden>★★★★★</div>
                    <p className="text-brand-black/80 text-[15px] leading-[1.9] mb-6 flex-1">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <footer className="flex items-center gap-3 pt-4 border-t border-brand-beige-dark">
                      <span className="w-10 h-10 rounded-full bg-brand-black text-brand-gold flex items-center justify-center font-bold text-sm border-2 border-brand-gold/50">
                        {t.name.charAt(0)}
                      </span>
                      <span>
                        <span className="block font-semibold text-brand-black text-sm">{t.name}</span>
                        <span className="block text-brand-gray text-xs">{t.city}</span>
                      </span>
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-20 md:py-32 bg-brand-white">
          <Reveal className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-black mb-5">
              ابدئي روتينك مع نقاء
            </h2>
            <p className="text-brand-gray text-base mb-9 leading-relaxed">
              طلبك يصلك لباب البيت — تدفعين عند الاستلام فقط.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-brand-black text-brand-white text-sm font-semibold tracking-wide px-12 py-4 rounded-full transition-all duration-300 hover:bg-brand-gold active:scale-[0.98]"
            >
              تسوّقي الآن
            </Link>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
