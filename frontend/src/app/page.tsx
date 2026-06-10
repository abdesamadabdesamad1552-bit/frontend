"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { ArrowLeft, CheckCircle, ShieldCheck, Sparkles, Truck } from "lucide-react";

const pillars = [
  {
    icon: Sparkles,
    title: "مكونات فعّالة",
    text: "تركيزات حقيقية — فيتامين سي، نياسيناميد، ريتينول، وغيرها.",
  },
  {
    icon: ShieldCheck,
    title: "مصممة للخليج",
    text: "تركيبات تتحمل الحرارة والرطوبة — بدون أكسدة ولا دهنية زائدة.",
  },
  {
    icon: Truck,
    title: "توصيل + COD",
    text: "توصيل مجاني لجميع دول GCC. الدفع عند الاستلام فقط.",
  },
];

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
  const heroProduct = products[0];

  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,83,0.08),transparent_55%)]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div>
              <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.25em] text-gold/70">
                Naqa Beauty · GCC
              </p>

              <h1 className="mb-6 text-[clamp(2.25rem,5.5vw,4.25rem)] font-bold leading-[1.15] text-white">
                نقاء للتجميل الفاخر
                <span className="mt-3 block text-[clamp(1.25rem,3vw,2rem)] font-medium text-gold">
                  لأن بشرتك تستحق الأنقى
                </span>
              </h1>

              <p className="mb-10 max-w-lg text-[16px] leading-[1.9] text-white/60">
                5 منتجات premium تحل مشاكل حقيقية — تصبغات، جفاف، تساقط الشعر،
                هالات، وحب الشباب. توصيل مجاني ودفع عند الاستلام.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-4 text-[15px] font-bold text-[#0a0a0a] transition-colors hover:bg-gold-light"
                >
                  تسوقي المجموعة
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link
                  href={`/products/${heroProduct.slug}`}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 px-8 py-4 text-[15px] font-medium text-white/80 transition-colors hover:border-gold/30 hover:text-gold"
                >
                  المنتج الأكثر مبيعاً
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-white/45">
                {["توصيل مجاني GCC", "الدفع عند الاستلام", "مكونات مثبتة علمياً"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gold/50" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 480px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-gold/60">{heroProduct.badge}</p>
                  <h2 className="mb-2 text-xl font-semibold text-white">{heroProduct.name}</h2>
                  <p className="text-[14px] text-white/50">{heroProduct.tagline}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="border-t border-white/[0.06] py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 text-center md:mb-16">
              <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gold/60">المجموعة</p>
              <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-white">
                5 منتجات — 5 حلول
              </h2>
              <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-white/50">
                كل منتج يستهدف مشكلة محددة. اختاري ما يناسبك أو كوني مجموعة كاملة.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-gold transition-colors hover:text-gold-light"
              >
                عرض كل المنتجات
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="border-t border-white/[0.06] bg-[#0a0a0a] py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {pillars.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/[0.06] bg-[#111111] p-8"
                >
                  <div className="mb-5 inline-flex rounded-xl border border-gold/15 bg-gold/5 p-3">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
                  <p className="text-[14px] leading-relaxed text-white/50">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-white/[0.06] py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-white">
                آراء عميلاتنا
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <blockquote
                  key={t.name}
                  className="rounded-2xl border border-white/[0.06] bg-[#111111] p-6"
                >
                  <p className="mb-5 text-[14px] leading-[1.85] text-white/65">&ldquo;{t.text}&rdquo;</p>
                  <footer className="border-t border-white/[0.06] pt-4">
                    <p className="text-[13px] font-semibold text-white">{t.name}</p>
                    <p className="text-[12px] text-white/40">{t.city}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/[0.06] py-20 md:py-28">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-white">
              ابدئي رحلتك مع نقاء
            </h2>
            <p className="mb-10 text-[15px] leading-relaxed text-white/50">
              طلبك يصلك لباب البيت — تدفعي عند الاستلام فقط.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-10 py-4 text-[15px] font-bold text-[#0a0a0a] transition-colors hover:bg-gold-light"
            >
              تسوقي الآن
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
