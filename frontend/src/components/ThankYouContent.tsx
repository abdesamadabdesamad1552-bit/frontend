"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Phone,
  Package,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronLeft,
  Star,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getLastOrderId } from "@/lib/order-redirect";
import {
  getOrderSnapshot,
  formatPhoneDisplay,
  formatCustomerName,
  snapshotCurrencySymbol,
} from "@/lib/order-snapshot";
import { getCallWindowMessage } from "@/lib/call-window";
import { products, getPrimaryImage } from "@/lib/products";
import { bundles } from "@/lib/bundles";
import AddToCartButton from "@/components/AddToCartButton";

const RESULTS_COPY: Record<number, string> = {
  1: "مع الاستخدام المنتظم، أغلب عميلاتنا يلاحظن توحّد لون البشرة خلال 3–4 أسابيع.",
  2: "النضارة تبان من أول استخدامات — روتين ليلي بسيط ونتائج تدوم.",
  3: "الكثافة تبدأ بالظهور خلال 8–12 أسبوع — الاستمرار هو مفتاح النتيجة.",
  4: "انتفاخ العيون يخف فوراً — التفتيح يبان تدريجياً خلال 4 أسابيع.",
  5: "المسام تتنقى واللمعان يقل — بشرة متوازنة طول اليوم.",
};

export default function ThankYouContent() {
  const { resetFlow } = useCart();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId") || getLastOrderId();
  const snapshot = getOrderSnapshot();

  const orderId = orderIdParam || snapshot?.orderId || null;
  const country = snapshot?.country ?? "SA";
  const callMsg = useMemo(
    () =>
      getCallWindowMessage(
        country,
        snapshot?.createdAt ? new Date(snapshot.createdAt) : new Date()
      ),
    [country, snapshot?.createdAt]
  );

  useEffect(() => {
    resetFlow();
  }, [resetFlow]);

  const lineItems = useMemo(() => {
    if (!snapshot?.items.length) return [];
    return snapshot.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter(Boolean) as Array<{
      productId: number;
      quantity: number;
      isUpsell?: boolean;
      product: (typeof products)[0];
    }>;
  }, [snapshot?.items]);

  const orderedIds = new Set(snapshot?.items.map((i) => i.productId) ?? []);

  const crossSells = useMemo(
    () => products.filter((p) => !orderedIds.has(p.id)).slice(0, 3),
    [orderedIds]
  );

  const suggestedBundle = useMemo(() => {
    return bundles.find((b) => b.productIds.some((id) => !orderedIds.has(id)));
  }, [orderedIds]);

  const displayName = snapshot ? formatCustomerName(snapshot.name) : null;
  const displayPhone = snapshot
    ? formatPhoneDisplay(snapshot.phone, snapshot.country)
    : null;

  return (
    <>
      {/* Sticky confirmation banner */}
      <div
        className={`sticky top-0 z-40 px-4 py-3 text-center text-sm font-bold shadow-md ${
          callMsg.urgency === "now"
            ? "bg-amber-600 text-white animate-pulse"
            : "bg-brand-gold text-brand-white"
        }`}
      >
        {callMsg.banner}
      </div>

      <main className="bg-brand-beige min-h-[60vh] py-8 md:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Hero */}
          <section className="text-center pt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl mb-4">
              ✓
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-black mb-2">
              تم استلام طلبك، {displayName ? `${displayName}!` : "حبيبتنا!"}
            </h1>
            <p className="text-brand-gray text-sm md:text-base leading-relaxed max-w-md mx-auto">
              خطوة واحدة تفصلك عن استلام طلبك — تأكيد سريع عبر الهاتف.
            </p>
            {orderId && (
              <div className="inline-block mt-4 bg-brand-white border border-brand-beige-dark rounded-xl px-5 py-3">
                <p className="text-xs text-brand-gray mb-0.5">رقم الطلب</p>
                <p className="text-lg font-bold text-brand-gold" dir="ltr">
                  {orderId}
                </p>
              </div>
            )}
          </section>

          {/* Call expectation card */}
          <section className="bg-brand-white rounded-2xl border-2 border-brand-gold/40 p-5 md:p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-amber-700" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-base font-bold text-brand-black mb-1">
                  {callMsg.headline}
                </h2>
                <p className="text-sm text-brand-gray leading-relaxed">
                  {callMsg.subline}
                </p>
              </div>
            </div>

            {displayPhone && (
              <div className="bg-brand-beige rounded-xl p-4 space-y-2">
                <p className="text-xs text-brand-gray">سنتصل على هذا الرقم:</p>
                <p className="text-xl font-bold text-brand-black tracking-wide" dir="ltr">
                  {displayPhone}
                </p>
                {displayName && (
                  <p className="text-sm text-brand-gray">
                    باسم: <span className="font-medium text-brand-black">{snapshot!.name}</span>
                  </p>
                )}
              </div>
            )}

            <ul className="mt-4 space-y-2 text-sm text-brand-black/85">
              <li className="flex gap-2">
                <span className="text-brand-gold">•</span>
                <span>الرد على الاتصال = تأكيد الطلب والشحن خلال 2–5 أيام</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-gold">•</span>
                <span>لا حاجة لبطاقة بنك — الدفع نقداً عند الاستلام</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-gold">•</span>
                <span>رقم غير محفوظ؟ هذا طبيعي — نحن فريق نقاء</span>
              </li>
            </ul>
          </section>

          {/* Order summary */}
          {snapshot && lineItems.length > 0 && (
            <section className="bg-brand-white rounded-2xl border border-brand-beige-dark p-5 md:p-6">
              <h2 className="text-sm font-bold text-brand-black mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-gold" />
                ملخص طلبك
              </h2>
              <div className="space-y-4">
                {lineItems.map(({ product, quantity, isUpsell }) => (
                  <div key={product.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-brand-beige flex-shrink-0 border border-brand-beige-dark">
                      <Image
                        src={getPrimaryImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-semibold text-brand-black leading-snug break-words">
                        {product.name}
                      </p>
                      <p className="text-xs text-brand-gray mt-0.5">
                        × {quantity}
                        {isUpsell ? " · عرض خاص" : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-brand-beige-dark mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">التوصيل</span>
                  <span className="text-emerald-600 font-semibold">مجاني</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-bold text-brand-black">المبلغ عند الاستلام</span>
                  <span className="text-2xl font-bold text-brand-black tabular-nums">
                    {snapshot.total} {snapshotCurrencySymbol(snapshot.country)}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* What happens next */}
          <section className="bg-brand-white rounded-2xl border border-brand-beige-dark p-5 md:p-6">
            <h2 className="text-sm font-bold text-brand-black mb-4">ماذا يحدث الآن؟</h2>
            <ol className="space-y-4">
              {[
                {
                  icon: Phone,
                  title:
                    callMsg.urgency === "now"
                      ? "اتصال خلال 10 دقائق"
                      : "اتصال الساعة 9 صباحاً",
                  desc: "نؤكد اسمك، عنوانك، وموعد التوصيل المناسب.",
                },
                {
                  icon: Package,
                  title: "تجهيز وشحن مجاني",
                  desc: "طلبك يُغلّف بعناية ويُشحن لجميع مدن الخليج.",
                },
                {
                  icon: Sparkles,
                  title: "استلمي وادفعي عند الباب",
                  desc: "تفحصي الطلب براحتك — الدفع نقداً فقط.",
                },
              ].map(({ icon: Icon, title, desc }, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-brand-black flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      {title}
                    </p>
                    <p className="text-xs text-brand-gray mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Results excitement */}
          {lineItems.length > 0 && (
            <section className="bg-gradient-to-br from-amber-50 to-brand-beige rounded-2xl border border-brand-gold/20 p-5 md:p-6">
              <h2 className="text-sm font-bold text-brand-black mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-gold" />
                ماذا تتوقعين بعد التأكيد؟
              </h2>
              <div className="space-y-3">
                {lineItems.map(({ product }) => (
                  <div
                    key={product.id}
                    className="bg-brand-white/80 rounded-xl p-3 border border-brand-beige-dark/50"
                  >
                    <p className="text-sm font-semibold text-brand-black mb-1">
                      {product.name}
                    </p>
                    <p className="text-xs text-brand-gray leading-relaxed">
                      {RESULTS_COPY[product.id] ?? product.hook}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Social proof */}
          <section className="grid grid-cols-3 gap-2 text-center">
            {[
              { stat: "+2000", label: "عميلة في الخليج" },
              { stat: "94%", label: "تأكدت من أول اتصال" },
              { stat: "2–5", label: "أيام توصيل مجاني" },
            ].map(({ stat, label }) => (
              <div
                key={label}
                className="bg-brand-white rounded-xl border border-brand-beige-dark py-3 px-2"
              >
                <p className="text-lg font-bold text-brand-gold">{stat}</p>
                <p className="text-[10px] text-brand-gray leading-tight mt-0.5">{label}</p>
              </div>
            ))}
          </section>

          <div className="bg-brand-white rounded-xl border border-brand-beige-dark p-4 flex gap-3">
            <div className="flex gap-0.5 flex-shrink-0 pt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-brand-gold text-brand-gold" />
              ))}
            </div>
            <p className="text-xs text-brand-gray leading-relaxed italic">
              &ldquo;رديت على الاتصال ووصل الطلب بسرعة — المنتج فعلاً يستاهل.&rdquo;
              <span className="block not-italic text-brand-black/70 mt-1 font-medium">
                — سارة، الرياض
              </span>
            </p>
          </div>

          {/* Bundle upsell */}
          {suggestedBundle && (
            <section className="bg-brand-black text-brand-white rounded-2xl p-5 md:p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                {suggestedBundle.badge}
              </span>
              <h2 className="text-lg font-bold mt-1 mb-1">{suggestedBundle.name}</h2>
              <p className="text-sm text-brand-white/75 mb-4">{suggestedBundle.tagline}</p>
              <Link
                href="/shop#bundles"
                className="inline-flex items-center gap-1 text-sm font-bold text-brand-gold hover:text-brand-gold-light transition-colors"
              >
                اكتشفي المجموعة
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </section>
          )}

          {/* Cross-sells */}
          {crossSells.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-brand-black mb-4 text-center">
                أكملي روتينك مع نقاء
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {crossSells.map((product) => (
                  <div
                    key={product.id}
                    className="bg-brand-white rounded-xl border border-brand-beige-dark overflow-hidden flex flex-col"
                  >
                    <Link href={`/products/${product.slug}`} className="relative aspect-square block">
                      <Image
                        src={getPrimaryImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </Link>
                    <div className="p-3 flex flex-col flex-1">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-xs font-bold text-brand-black line-clamp-2 hover:text-brand-gold">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-[10px] text-brand-gray mt-1 line-clamp-2 flex-1">
                        {product.hook}
                      </p>
                      <AddToCartButton
                        productId={product.id}
                        label="أضف للسلة"
                        className="w-full text-xs py-2 mt-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Mini FAQ */}
          <section className="bg-brand-white rounded-2xl border border-brand-beige-dark p-5">
            <h2 className="text-sm font-bold text-brand-black mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-gold" />
              أسئلة سريعة
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-brand-black">لم أرد على الاتصال؟</dt>
                <dd className="text-brand-gray text-xs mt-0.5 leading-relaxed">
                  سنعاود الاتصال مرة أخرى — أو تواصلي معنا عبر صفحة التواصل.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-black">هل أدفع قبل الاستلام؟</dt>
                <dd className="text-brand-gray text-xs mt-0.5 leading-relaxed">
                  لا — الدفع نقداً عند استلام الطلب فقط.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-black">متى يصل الطلب؟</dt>
                <dd className="text-brand-gray text-xs mt-0.5 leading-relaxed">
                  2–5 أيام عمل بعد تأكيد الطلب عبر الهاتف.
                </dd>
              </div>
            </dl>
          </section>

          <div className="text-center pb-8">
            <Link
              href="/shop"
              className="inline-block bg-brand-black text-brand-white font-bold px-8 py-3.5 rounded-xl hover:bg-brand-gold transition-colors text-sm"
            >
              متابعة التسوق
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
