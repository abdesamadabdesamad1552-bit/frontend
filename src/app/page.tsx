import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { products } from "@/lib/products";
import type { Product } from "@/lib/products";

const trustPillars = [
  {
    icon: "🧪",
    title: "تركيزات حقيقية",
    description: "نسب دقيقة لكل مكون — مو بس \"يحتوي على\"",
  },
  {
    icon: "☀️",
    title: "مصمم للخليج",
    description: "تركيبات مستقرة في الحرارة العالية والرطوبة",
  },
  {
    icon: "🔍",
    title: "شفافية كاملة",
    description: "قائمة مكونات واضحة مع شرح لكل مكون",
  },
  {
    icon: "✅",
    title: "نتائج مرئية",
    description: "مكونات مثبتة بدراسات سريرية — مو وعود فارغة",
  },
];

const testimonials = [
  {
    name: "سارة م.",
    location: "الرياض",
    product: "سيروم الإشراق",
    text: "من أول أسبوع لاحظت فرق في توحد لون بشرتي. التصبغات اللي حول فمي بدت تخف بشكل واضح. أخيراً منتج يشتغل فعلاً!",
    rating: 5,
  },
  {
    name: "نورة ع.",
    location: "جدة",
    product: "قناع النضارة الذهبي",
    text: "أحطه قبل النوم وأصبّح ببشرة مختلفة تماماً. النضارة واضحة والجفاف اختفى. العبوة الذهبية فخمة جداً!",
    rating: 5,
  },
  {
    name: "فهد ك.",
    location: "دبي",
    product: "سيروم تكثيف الشعر",
    text: "جربت كل الزيوت والأدوات بدون فايدة. سيروم الريدنسيل كان مختلف — شعري بدأ يتكاثف من الشهر الثاني. الرأس الإبري سهّل التطبيق.",
    rating: 5,
  },
  {
    name: "لمياء ه.",
    location: "الكويت",
    product: "كريم العيون",
    text: "الرأس المعدني البارد يعطي إحساس فوري بالانتعاش. الهالات خفت بشكل ملحوظ بعد 3 أسابيع. ما أقدر أستغني عنه.",
    rating: 5,
  },
];

function HeroSection() {
  return (
    <section className="relative bg-brand-beige overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-brand-gold blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-brand-gold blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-36 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-brand-white/80 border border-brand-gold/20 text-sm text-brand-gold-dark font-medium">
          تركيبات علمية — مكونات فعّالة — تركيزات حقيقية
        </div>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-brand-black leading-tight mb-6">
          لأن بشرتك
          <br />
          <span className="text-brand-gold">تستحق الأنقى</span>
        </h2>

        <p className="text-lg md:text-xl text-brand-gray max-w-2xl mx-auto mb-10 leading-relaxed">
          حلول عناية فاخرة بمكونات مثبتة بتركيزات دقيقة — مصممة خصيصاً لمناخ
          الخليج وبشرته. ليست وعوداً فارغة، بل نتائج مرئية.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-brand-black text-brand-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-brand-gold transition-colors"
          >
            اكتشفي المجموعة
            <svg
              className="w-4 h-4 rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>

          <a
            href="#products"
            className="inline-flex items-center justify-center gap-2 bg-brand-white text-brand-black px-8 py-4 rounded-xl text-base font-semibold border border-brand-beige-dark hover:border-brand-gold transition-colors"
          >
            تصفحي المنتجات
          </a>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="bg-brand-white border-y border-brand-beige-dark">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center">
            <span className="text-2xl font-bold text-brand-gold">+2,347</span>
            <p className="text-sm text-brand-gray mt-1">عميلة سعيدة</p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-brand-gold">★★★★★</span>
            <p className="text-sm text-brand-gray mt-1">تقييم 4.9 من 5</p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-brand-gold">5</span>
            <p className="text-sm text-brand-gray mt-1">منتجات متخصصة</p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-brand-gold">6</span>
            <p className="text-sm text-brand-gray mt-1">دول خليجية</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-brand-white rounded-2xl border border-brand-beige-dark hover:border-brand-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/5 overflow-hidden flex flex-col">
      <div className="relative aspect-square overflow-hidden">
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
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-brand-black mb-1 group-hover:text-brand-gold transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-brand-gray mb-3">{product.subtitle}</p>
        <p className="text-sm text-brand-black/70 mb-4 leading-relaxed">
          {product.description}
        </p>

        <div className="mb-4 flex-1">
          <p className="text-xs font-semibold text-brand-gray mb-2 uppercase tracking-wider">
            المكونات الرئيسية
          </p>
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

        <p className="text-xs text-brand-gray mb-4">{product.format}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-beige">
          <Link
            href={`/products/${product.slug}`}
            className="text-xs text-brand-gold font-semibold hover:underline"
          >
            التفاصيل
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

function ProductsSection() {
  return (
    <section id="products" className="bg-brand-beige/40 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
            مجموعتنا الكاملة
          </h2>
          <p className="text-brand-gray max-w-xl mx-auto">
            5 منتجات — كل منتج يحل مشكلة مختلفة تماماً. تركيبات علمية بمكونات
            فعّالة بتركيزات حقيقية.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 max-w-2xl lg:max-w-none lg:grid-cols-2 mx-auto">
          {products.slice(3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyNaqaSection() {
  return (
    <section id="why-naqa" className="bg-brand-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
            لماذا نقاء؟
          </h2>
          <p className="text-brand-gray max-w-xl mx-auto">
            ليست مجرد مستحضرات تجميل — بل حلول علمية مصممة لبشرتك ومناخك
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="text-center p-8 rounded-2xl bg-brand-beige/50 border border-brand-beige-dark hover:border-brand-gold/30 transition-colors"
            >
              <span className="text-4xl mb-4 block">{pillar.icon}</span>
              <h3 className="text-base font-bold text-brand-black mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-brand-gray leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-5 rounded-xl bg-brand-beige/30 border border-brand-beige-dark">
            <span className="text-brand-gold text-xl">✓</span>
            <span className="text-sm font-medium text-brand-black">
              0% هيدروكينون — 0% كورتيزون — 0% عطور صناعية
            </span>
          </div>
          <div className="flex items-center gap-3 p-5 rounded-xl bg-brand-beige/30 border border-brand-beige-dark">
            <span className="text-brand-gold text-xl">✓</span>
            <span className="text-sm font-medium text-brand-black">
              فيتامين سي مستقر — لا يتأكسد في حرارة الخليج
            </span>
          </div>
          <div className="flex items-center gap-3 p-5 rounded-xl bg-brand-beige/30 border border-brand-beige-dark">
            <span className="text-brand-gold text-xl">✓</span>
            <span className="text-sm font-medium text-brand-black">
              تغليف زجاجي فاخر — يحمي التركيبة ويحافظ على الجودة
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-brand-beige/40 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
            ماذا تقول عميلاتنا
          </h2>
          <p className="text-brand-gray">تجارب حقيقية — نتائج حقيقية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-brand-white p-6 rounded-2xl border border-brand-beige-dark hover:border-brand-gold/30 transition-colors"
            >
              <div className="flex gap-0.5 mb-3 text-brand-gold">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-sm text-brand-black/80 leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="pt-4 border-t border-brand-beige">
                <p className="text-sm font-bold text-brand-black">{t.name}</p>
                <p className="text-xs text-brand-gray">
                  {t.location} — {t.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="bg-brand-black py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">
          ابدئي رحلتك مع <span className="text-brand-gold">نقاء</span>
        </h2>
        <p className="text-brand-white/60 mb-10 text-lg">
          اكتشفي المجموعة الكاملة — توصيل مجاني لجميع دول الخليج — الدفع عند
          الاستلام
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-black px-8 py-4 rounded-xl text-base font-bold hover:bg-brand-gold-light transition-colors"
          >
            تسوقي الآن
            <svg
              className="w-4 h-4 rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-brand-white/40 text-sm">
          <span className="flex items-center gap-2">
            <span className="text-brand-gold">✓</span> توصيل مجاني
          </span>
          <span className="flex items-center gap-2">
            <span className="text-brand-gold">✓</span> الدفع عند الاستلام
          </span>
          <span className="flex items-center gap-2">
            <span className="text-brand-gold">✓</span> ضمان الرضا
          </span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <TrustBar />
      <ProductsSection />
      <WhyNaqaSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </>
  );
}
