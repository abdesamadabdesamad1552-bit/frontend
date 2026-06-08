"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { products } from "@/lib/products";
import type { Product } from "@/lib/products";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  FlaskConical,
  Sun,
  ShieldCheck,
  Gem,
  Truck,
  Star,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Users,
  Award,
  Globe,
  Quote,
} from "lucide-react";
import { useRef, useEffect, useState, type ReactNode } from "react";

/* ━━━ Animated Counter ━━━ */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setValue(start);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ━━━ Section Wrapper ━━━ */
function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative py-24 md:py-32 ${className}`}>
      {children}
    </section>
  );
}

/* ━━━ Section Label ━━━ */
function SectionLabel({ icon: Icon, text }: { icon: typeof Sparkles; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-center gap-3 mb-6"
    >
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/30" />
      <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-gold/70 font-medium">
        <Icon className="w-3 h-3" />
        {text}
      </span>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/30" />
    </motion.div>
  );
}

/* ━━━ Floating Product Card with 3D Parallax ━━━ */
function FloatingProductCard() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 120,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 20,
  });
  const glowX = useTransform(x, [-0.5, 0.5], ["30%", "70%"]);
  const glowY = useTransform(y, [-0.5, 0.5], ["30%", "70%"]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const product = products[0];

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[300px] mx-auto"
    >
      {/* Ambient glow that tracks mouse */}
      <motion.div
        className="absolute -inset-8 rounded-3xl blur-3xl opacity-40"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) =>
              `radial-gradient(circle at ${gx} ${gy}, rgba(212,168,83,0.2), rgba(155,109,255,0.08), transparent 70%)`
          ),
        }}
      />

      {/* Card */}
      <div className="relative rounded-2xl overflow-hidden border border-glass-border bg-obsidian-surface shine-sweep glow-gold-strong">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="300px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-surface via-obsidian/40 to-transparent" />

          <div className="absolute top-4 right-4">
            <span className="glass-strong text-gold text-[11px] font-semibold px-3 py-1.5 rounded-full border border-gold/15">
              {product.badge}
            </span>
          </div>
        </div>

        <div className="relative p-5 -mt-10 z-10">
          <h3 className="text-[17px] font-bold text-text-primary mb-1">
            {product.name}
          </h3>
          <p className="text-[13px] text-text-muted mb-4">{product.subtitle}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {product.ingredients.slice(0, 3).map((ing) => (
              <span
                key={ing.name}
                className="text-[10px] px-2 py-1 rounded-full bg-white/[0.04] text-text-muted border border-glass-border"
              >
                {ing.name}
                {ing.concentration && (
                  <span className="text-gold mr-1 font-semibold">
                    {ing.concentration}
                  </span>
                )}
              </span>
            ))}
          </div>

          <AddToCartButton
            productId={product.id}
            label="أضف للسلة"
            className="w-full text-[13px] px-5 py-3"
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ━━━ HERO ━━━ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden aurora grain">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top fade line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="flex items-center gap-2 mb-10"
            >
              <span className="h-px w-6 bg-gold/40" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold/60 font-medium">
                Premium Skincare
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.1] mb-8"
            >
              لأن بشرتك
              <br />
              <span className="text-gradient">تستحق الأنقى</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
              className="text-[17px] text-text-secondary max-w-md leading-[1.8] mb-12"
            >
              حلول عناية فاخرة بمكونات مثبتة بتركيزات دقيقة — مصممة خصيصاً
              لمناخ الخليج وبشرته.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/shop">
                <motion.span
                  whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(212,168,83,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 bg-gold text-obsidian px-8 py-4 rounded-xl text-[15px] font-bold hover:bg-gold-light transition-colors cursor-pointer"
                >
                  اكتشفي المجموعة
                  <ArrowLeft className="w-4 h-4" />
                </motion.span>
              </Link>

              <a href="#products">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[15px] font-medium text-text-muted border border-glass-border hover:border-gold/20 hover:text-text-secondary transition-all cursor-pointer"
                >
                  تصفحي المنتجات
                </motion.span>
              </a>
            </motion.div>
          </div>

          {/* Card */}
          <div className="order-first lg:order-last flex justify-center">
            <FloatingProductCard />
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-glass-border to-transparent z-10" />
    </section>
  );
}

/* ━━━ STATS BAR ━━━ */
function StatsBar() {
  const stats = [
    { icon: Users, value: 2347, suffix: "+", label: "عميلة سعيدة" },
    { icon: Star, value: 4.9, suffix: "", label: "تقييم من 5", isDecimal: true },
    { icon: Award, value: 5, suffix: "", label: "منتجات متخصصة" },
    { icon: Globe, value: 6, suffix: "", label: "دول خليجية" },
  ];

  return (
    <div className="relative border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="text-center"
            >
              <stat.icon className="w-4 h-4 text-gold/50 mx-auto mb-3" strokeWidth={1.5} />
              <span className="text-[28px] font-bold text-text-primary block leading-none">
                {stat.isDecimal ? (
                  <span className="tabular-nums">4.9</span>
                ) : (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                )}
              </span>
              <p className="text-[12px] text-text-muted mt-2 tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ━━━ PRODUCT CARD ━━━ */
function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group rounded-2xl border border-glass-border hover:border-gold/15 bg-obsidian-surface transition-all duration-700 overflow-hidden flex flex-col shine-sweep hover:shadow-[0_8px_60px_rgba(212,168,83,0.08)]"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.06] transition-transform duration-[900ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-surface via-obsidian/20 to-transparent" />

        <span className="absolute top-4 right-4 z-10 glass-strong text-gold text-[10px] font-semibold px-3 py-1.5 rounded-full border border-gold/10">
          {product.badge}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[16px] font-bold text-text-primary mb-1 group-hover:text-gold transition-colors duration-500">
          {product.name}
        </h3>
        <p className="text-[13px] text-text-muted mb-3">{product.subtitle}</p>
        <p className="text-[13px] text-text-muted/70 mb-5 leading-relaxed">
          {product.description}
        </p>

        <div className="mb-5 flex-1">
          <p className="text-[10px] font-medium text-text-faint mb-2 uppercase tracking-[0.15em]">
            المكونات
          </p>
          <div className="flex flex-wrap gap-1.5">
            {product.ingredients.map((ing) => (
              <span
                key={ing.name}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-white/[0.03] text-text-muted border border-glass-border"
              >
                {ing.name}
                {ing.concentration && (
                  <span className="font-bold text-gold">{ing.concentration}</span>
                )}
              </span>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-text-faint mb-5">{product.format}</p>

        <div className="flex items-center justify-between pt-4 border-t border-glass-border">
          <Link
            href={`/products/${product.slug}`}
            className="text-[12px] text-gold/70 font-medium hover:text-gold transition-colors"
          >
            التفاصيل
          </Link>
          <AddToCartButton
            productId={product.id}
            label="أضف للسلة"
            className="text-[12px] px-4 py-2"
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ━━━ PRODUCTS SECTION ━━━ */
function ProductsSection() {
  return (
    <Section id="products">
      {/* BG orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/[0.015] blur-[200px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <SectionLabel icon={Gem} text="المجموعة" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-text-primary mb-4">
            مجموعتنا <span className="text-gradient">الكاملة</span>
          </h2>
          <p className="text-[15px] text-text-muted max-w-lg mx-auto leading-relaxed">
            5 منتجات متخصصة — كل منتج يحل مشكلة مختلفة تماماً
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.slice(0, 3).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 max-w-2xl lg:max-w-none lg:grid-cols-2 mx-auto">
          {products.slice(3).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i + 3} />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ━━━ Trust Pillars (Bento Grid) ━━━ */
const pillars = [
  {
    icon: FlaskConical,
    title: "السلطة العلمية",
    subtitle: "تركيزات مثبتة — وليست ادعاءات",
    description:
      "فيتامين سي 10% — نياسيناميد 5% — ريدنسيل 3%. نكتب النسبة الدقيقة لأن عميلتنا تستحق أن تعرف.",
    span: "lg:col-span-2",
  },
  {
    icon: Sun,
    title: "التخصص الخليجي",
    subtitle: "مصمم لمناخك",
    description:
      "فيتامين سي مستقر لا يتأكسد في 45°C. اختُبر في رطوبة الساحل وجفاف الصحراء.",
    span: "",
  },
  {
    icon: ShieldCheck,
    title: "الشفافية المطلقة",
    subtitle: "لا نخفي شيئاً",
    description: "قائمة مكونات كاملة. 0% هيدروكينون. 0% كورتيزون. 0% عطور صناعية.",
    span: "",
  },
  {
    icon: Gem,
    title: "الفخامة المدروسة",
    subtitle: "تجربة تبدأ من لحظة الاستلام",
    description:
      "عبوات زجاجية فاخرة. كرتون أسود مطفي بختم ذهبي. المنتج الذي يعتني ببشرتك يُعامل باحترام.",
    span: "lg:col-span-2",
  },
];

function WhyNaqaSection() {
  return (
    <Section className="overflow-hidden">
      {/* BG */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-aurora-violet/[0.02] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/[0.02] blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <SectionLabel icon={ShieldCheck} text="ما يميّزنا" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-text-primary mb-4">
            لماذا تثق أكثر من{" "}
            <span className="text-gradient">
              <AnimatedCounter target={2347} suffix="" />
              {" "}عميلة
            </span>{" "}
            في نقاء؟
          </h2>
          <p className="text-[15px] text-text-muted max-w-xl mx-auto leading-relaxed">
            لأننا لا نبيع وعوداً — بل نقدم تركيبات علمية بتركيزات حقيقية
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className={`group relative p-7 rounded-2xl bg-obsidian-surface border border-glass-border hover:border-gold/15 transition-all duration-700 overflow-hidden ${p.span}`}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="w-9 h-9 rounded-lg bg-gold/[0.06] border border-gold/10 flex items-center justify-center mb-5 group-hover:border-gold/25 transition-colors duration-500">
                <p.icon className="w-[18px] h-[18px] text-gold/80" strokeWidth={1.5} />
              </div>

              <h3 className="text-[15px] font-bold text-text-primary mb-1">
                {p.title}
              </h3>
              <p className="text-[11px] text-gold/50 font-medium mb-3">
                {p.subtitle}
              </p>
              <p className="text-[13px] text-text-muted leading-[1.7]">
                {p.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 pt-10 border-t border-glass-border"
        >
          {[
            { icon: CheckCircle, text: "ضمان بدون مخاطرة" },
            { icon: Truck, text: "توصيل مجاني — الدفع عند الاستلام" },
            { icon: Star, text: "تقييم 4.9 من 5 نجوم" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2.5 text-text-muted">
              <item.icon className="w-4 h-4 text-gold/50" strokeWidth={1.5} />
              <span className="text-[13px]">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ━━━ TESTIMONIALS ━━━ */
const testimonials = [
  {
    name: "سارة م.",
    location: "الرياض",
    product: "سيروم الإشراق",
    text: "من أول أسبوع لاحظت فرق في توحد لون بشرتي. التصبغات اللي حول فمي بدت تخف بشكل واضح. أخيراً منتج يشتغل فعلاً!",
  },
  {
    name: "نورة ع.",
    location: "جدة",
    product: "قناع النضارة الذهبي",
    text: "أحطه قبل النوم وأصبّح ببشرة مختلفة تماماً. النضارة واضحة والجفاف اختفى. العبوة الذهبية فخمة جداً!",
  },
  {
    name: "فهد ك.",
    location: "دبي",
    product: "سيروم تكثيف الشعر",
    text: "جربت كل الزيوت والأدوات بدون فايدة. سيروم الريدنسيل كان مختلف — شعري بدأ يتكاثف من الشهر الثاني.",
  },
  {
    name: "لمياء ه.",
    location: "الكويت",
    product: "كريم العيون",
    text: "الرأس المعدني البارد يعطي إحساس فوري بالانتعاش. الهالات خفت بشكل ملحوظ بعد 3 أسابيع.",
  },
];

function TestimonialsSection() {
  return (
    <Section>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-aurora-blue/[0.015] blur-[180px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <SectionLabel icon={Quote} text="آراء العملاء" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-text-primary mb-4">
            ماذا تقول <span className="text-gradient">عميلاتنا</span>
          </h2>
          <p className="text-[15px] text-text-muted">
            تجارب حقيقية — نتائج حقيقية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-obsidian-surface border border-glass-border hover:border-gold/10 transition-all duration-700"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-gold/70 text-gold/70" />
                ))}
              </div>

              <p className="text-[13px] text-text-secondary leading-[1.8] mb-5">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="pt-4 border-t border-glass-border">
                <p className="text-[13px] font-semibold text-text-primary">{t.name}</p>
                <p className="text-[11px] text-text-faint mt-0.5">
                  {t.location} — {t.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ━━━ CTA ━━━ */
function CtaSection() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden aurora grain">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aurora-violet/15 to-transparent" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <SectionLabel icon={Sparkles} text="ابدئي الآن" />

          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text-primary mb-5 leading-tight">
            ابدئي رحلتك مع <span className="text-gradient">نقاء</span>
          </h2>
          <p className="text-[16px] text-text-muted mb-12 leading-relaxed">
            اكتشفي المجموعة الكاملة — توصيل مجاني لجميع دول الخليج
          </p>

          <Link href="/shop">
            <motion.span
              whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(212,168,83,0.25)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 bg-gold text-obsidian px-10 py-4 rounded-xl text-[15px] font-bold hover:bg-gold-light transition-colors cursor-pointer"
            >
              تسوقي الآن
              <ArrowLeft className="w-4 h-4" />
            </motion.span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-14 text-text-faint text-[12px]">
            {["توصيل مجاني", "الدفع عند الاستلام", "ضمان الرضا"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gold/40" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ━━━ PAGE ━━━ */
export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <StatsBar />
      <ProductsSection />
      <WhyNaqaSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </>
  );
}
