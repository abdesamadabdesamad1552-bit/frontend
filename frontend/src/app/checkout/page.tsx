"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { products, getPrimaryImage } from "@/lib/products";
import {
  calculateCartTotal,
  getSinglePrice,
  getCodFee,
  formatPrice,
  validatePhone,
  normalizePhone,
  getPhoneError,
  countries,
} from "@/lib/pricing";
import { placeOrder } from "@/lib/checkout-flow";
import { getThankYouPath, storeLastOrderId } from "@/lib/order-redirect";
import { storeOrderSnapshot } from "@/lib/order-snapshot";
import LogoMark from "@/components/LogoMark";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Star,
  CheckCircle2,
} from "lucide-react";

type Method = "card" | "tabby" | "tamara" | "cod";

const PAYMENT_METHODS: {
  id: Method;
  title: string;
  subtitle: string;
  tags: string[];
}[] = [
  {
    id: "card",
    title: "بطاقة بنكية",
    subtitle: "ادفعي بأمان عبر مدى، فيزا، أو ماستركارد",
    tags: ["mada", "VISA", "Mastercard"],
  },
  {
    id: "tabby",
    title: "قسّمها على 4 دفعات — tabby",
    subtitle: "بدون فوائد، الدفعة الأولى اليوم والباقي شهرياً",
    tags: ["tabby"],
  },
  {
    id: "tamara",
    title: "ادفعي لاحقاً أو قسّطها — tamara",
    subtitle: "ادفعي بعد الاستلام أو على 3 دفعات بدون رسوم",
    tags: ["tamara"],
  },
  {
    id: "cod",
    title: "الدفع عند الاستلام",
    subtitle: "ادفعي نقداً عند وصول الطلب لباب بيتك",
    tags: [],
  },
];

function SimpleHeader() {
  return (
    <header className="border-b border-brand-beige-dark bg-brand-white">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="نقاء">
          <LogoMark className="h-6 w-9 text-brand-gold" />
          <div className="w-px h-6 bg-brand-black/20" aria-hidden />
          <span className="font-logo-ar text-xl font-bold text-brand-black">نقاء</span>
        </Link>
        <span className="flex items-center gap-1.5 text-xs text-brand-gray">
          <Lock className="w-3.5 h-3.5 text-brand-gold-dark" strokeWidth={2.25} />
          دفع آمن ومشفّر
        </span>
      </div>
    </header>
  );
}

function SimpleFooter() {
  return (
    <footer className="border-t border-brand-beige-dark bg-brand-white py-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-gray">
        <p>© 2026 نقاء للتجميل الفاخر</p>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-brand-black transition-colors">الخصوصية</Link>
          <Link href="/returns" className="hover:text-brand-black transition-colors">الإرجاع</Link>
          <Link href="/terms" className="hover:text-brand-black transition-colors">الشروط</Link>
        </div>
      </div>
    </footer>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { state, totalItems, resetFlow } = useCart();
  const country = state.country;
  const countryConfig = countries[country];

  const [method, setMethod] = useState<Method>("cod");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [isApplePay, setIsApplePay] = useState(false);

  // Show the Apple Pay express button only where it can actually run.
  useEffect(() => {
    try {
      const w = window as unknown as {
        ApplePaySession?: { canMakePayments?: () => boolean };
      };
      if (w.ApplePaySession?.canMakePayments?.()) setIsApplePay(true);
    } catch {
      /* not available */
    }
  }, []);

  const cartProducts = useMemo(
    () =>
      state.items
        .map((item) => ({
          ...item,
          product: products.find((p) => p.id === item.productId)!,
        }))
        .filter((i) => i.product),
    [state.items]
  );

  const singlePrice = getSinglePrice(country);
  const subtotal = calculateCartTotal(totalItems, country);
  const codFee = getCodFee(country);
  const total = subtotal + (method === "cod" ? codFee : 0);
  const tabbyInstallment = Math.ceil(total / 4);

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 3) e.name = "الرجاء إدخال الاسم الكامل";
    if (!validatePhone(phone, country)) e.phone = getPhoneError(country);
    if (city.trim().length < 2) e.city = "الرجاء إدخال المدينة";
    if (address.trim().length < 5) e.address = "الرجاء إدخال العنوان بالتفصيل";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function startElectronicPayment(payMethod: "card" | "tabby" | "tamara" | "apple_pay") {
    setNotice("");
    const res = await fetch("/api/payments/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: payMethod,
        items: state.items,
        country,
        amount: total,
        currency: countryConfig.currency,
        customer: { name: name.trim(), phone, city: city.trim(), address: address.trim() },
      }),
    });
    const data = await res.json().catch(() => ({}));
    // Once implemented, the API returns a redirect URL to the gateway.
    if (res.ok && (data.redirectUrl || data.web_url || data.checkout_url)) {
      window.location.href = data.redirectUrl || data.web_url || data.checkout_url;
      return;
    }
    setNotice(
      data.message || "بوابة الدفع الإلكتروني قيد التفعيل. الدفع عند الاستلام متاح الآن."
    );
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setNotice("");
    try {
      if (method === "cod") {
        const orderId = await placeOrder(name.trim(), normalizePhone(phone, country), country, state.items);
        storeOrderSnapshot({
          orderId,
          name: name.trim(),
          phone: normalizePhone(phone, country),
          country,
          items: state.items,
          total,
          currency: countryConfig.currency,
          createdAt: new Date().toISOString(),
        });
        storeLastOrderId(orderId);
        resetFlow();
        router.push(getThankYouPath(orderId));
        return;
      }
      await startElectronicPayment(method);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  }

  const clearError = (key: string) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));

  const inputClass = (key: string) =>
    `w-full px-4 py-3.5 rounded-xl border bg-brand-white text-brand-black placeholder:text-brand-gray-light transition-colors focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/15 ${
      errors[key] ? "border-red-400 bg-red-50/40" : "border-brand-beige-dark"
    }`;

  // Empty cart
  if (cartProducts.length === 0) {
    return (
      <>
        <SimpleHeader />
        <main className="bg-brand-beige min-h-[60vh] flex items-center justify-center px-6 py-24">
          <div className="text-center max-w-sm">
            <span className="text-5xl block mb-4" aria-hidden>🛒</span>
            <h1 className="text-xl font-bold text-brand-black mb-2">سلتك فارغة</h1>
            <p className="text-brand-gray text-sm mb-8">
              أضيفي منتجاتك المفضلة ثم عودي لإتمام الطلب.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-brand-black text-brand-white text-sm font-semibold tracking-wide px-9 py-3.5 rounded-full transition-all duration-300 hover:bg-brand-gold active:scale-[0.98]"
            >
              تسوقي المجموعة
            </Link>
          </div>
        </main>
        <SimpleFooter />
      </>
    );
  }

  return (
    <>
      <SimpleHeader />

      <main id="main-content" className="bg-brand-beige min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-black text-center mb-8">
            إتمام الطلب
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">
            {/* ── Left: form ── */}
            <form onSubmit={handleSubmit} noValidate className="space-y-6 order-2 lg:order-1">
              {/* Apple Pay express (iOS only) */}
              {isApplePay && (
                <div className="bg-brand-white rounded-2xl border border-brand-beige-dark p-5 shadow-[var(--shadow-luxe)]">
                  <p className="text-xs text-brand-gray text-center mb-3">دفع سريع بنقرة واحدة</p>
                  <button
                    type="button"
                    onClick={() => startElectronicPayment("apple_pay")}
                    className="w-full h-12 rounded-full bg-brand-black text-brand-white text-lg font-medium flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98]"
                    aria-label="الدفع عبر Apple Pay"
                  >
                    <span aria-hidden></span>
                    <span>Pay</span>
                  </button>
                  <div className="flex items-center gap-3 mt-5">
                    <span className="h-px flex-1 bg-brand-beige-dark" />
                    <span className="text-xs text-brand-gray">أو أكملي بالبيانات</span>
                    <span className="h-px flex-1 bg-brand-beige-dark" />
                  </div>
                </div>
              )}

              {/* Contact + shipping */}
              <section className="bg-brand-white rounded-2xl border border-brand-beige-dark p-5 md:p-6 shadow-[var(--shadow-luxe)]">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-brand-black">بيانات التوصيل</h2>
                  <span className="inline-flex items-center gap-1.5 text-xs text-brand-gray">
                    <span className="text-base leading-none">{countryConfig.flag}</span>
                    {countryConfig.nameAr}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-black mb-1.5">الاسم الكامل</label>
                    <input id="name" type="text" value={name} placeholder="مثال: سارة أحمد"
                      onChange={(e) => { setName(e.target.value); clearError("name"); }}
                      className={inputClass("name")} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-brand-black mb-1.5">رقم الجوال</label>
                    <input id="phone" type="tel" dir="ltr" value={phone}
                      placeholder={country === "SA" || country === "AE" ? "05xxxxxxxx" : "xxxx xxxx"}
                      onChange={(e) => { setPhone(e.target.value); clearError("phone"); }}
                      className={inputClass("phone")} />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-brand-black mb-1.5">المدينة</label>
                      <input id="city" type="text" value={city} placeholder="مثال: الرياض"
                        onChange={(e) => { setCity(e.target.value); clearError("city"); }}
                        className={inputClass("city")} />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-brand-black mb-1.5">العنوان</label>
                      <input id="address" type="text" value={address} placeholder="الحي، الشارع، رقم المبنى"
                        onChange={(e) => { setAddress(e.target.value); clearError("address"); }}
                        className={inputClass("address")} />
                      {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment methods */}
              <section className="bg-brand-white rounded-2xl border border-brand-beige-dark p-5 md:p-6 shadow-[var(--shadow-luxe)]">
                <h2 className="text-base font-bold text-brand-black mb-5">طريقة الدفع</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => {
                    const selected = method === m.id;
                    return (
                      <label
                        key={m.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          selected
                            ? "border-brand-gold ring-2 ring-brand-gold/15 bg-brand-beige/40"
                            : "border-brand-beige-dark hover:border-brand-gold/40"
                        }`}
                      >
                        <input
                          type="radio" name="payment" value={m.id} checked={selected}
                          onChange={() => { setMethod(m.id); setNotice(""); }}
                          className="sr-only"
                        />
                        <span
                          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            selected ? "border-brand-gold" : "border-brand-gray-light"
                          }`}
                          aria-hidden
                        >
                          {selected && <span className="w-2.5 h-2.5 rounded-full bg-brand-gold" />}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-brand-black">{m.title}</span>
                            {m.id === "cod" && (
                              <span className="text-[11px] font-semibold text-brand-gold-dark bg-brand-gold/10 px-2 py-0.5 rounded-full">
                                +{formatPrice(codFee, country)} رسوم
                              </span>
                            )}
                          </span>
                          <span className="block text-xs text-brand-gray mt-1 leading-relaxed">{m.subtitle}</span>
                          {m.id === "tabby" && selected && (
                            <span className="block text-xs text-brand-black/70 mt-1.5">
                              4 دفعات × {formatPrice(tabbyInstallment, country)}
                            </span>
                          )}
                          {m.tags.length > 0 && (
                            <span className="flex items-center gap-1.5 mt-2">
                              {m.tags.map((t) => (
                                <span key={t} className="text-[10px] font-bold tracking-wide text-brand-gray bg-brand-beige border border-brand-beige-dark px-2 py-0.5 rounded">
                                  {t}
                                </span>
                              ))}
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {notice && (
                  <div className="mt-4 p-3.5 rounded-xl bg-brand-beige border border-brand-gold/30 text-sm text-brand-black/80">
                    {notice}
                  </div>
                )}
              </section>

              {/* Submit (desktop) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="hidden lg:flex w-full bg-brand-black text-brand-white text-base font-semibold py-4 rounded-full transition-all duration-300 hover:bg-brand-gold active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none items-center justify-center gap-2"
              >
                {isSubmitting
                  ? "جاري المعالجة..."
                  : method === "cod"
                  ? `تأكيد الطلب — ${formatPrice(total, country)}`
                  : `المتابعة للدفع — ${formatPrice(total, country)}`}
              </button>
            </form>

            {/* ── Right: order summary ── */}
            <aside className="order-1 lg:order-2 lg:sticky lg:top-6 space-y-4">
              <div className="bg-brand-white rounded-2xl border border-brand-beige-dark p-5 md:p-6 shadow-[var(--shadow-luxe)]">
                <h2 className="text-base font-bold text-brand-black mb-4">ملخص الطلب</h2>
                <div className="space-y-4 mb-5">
                  {cartProducts.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-brand-beige border border-brand-beige-dark shrink-0">
                        <Image src={getPrimaryImage(product)} alt={product.name} fill sizes="64px" className="object-cover" />
                        <span className="absolute -top-1.5 -left-1.5 min-w-[1.1rem] h-[1.1rem] px-1 bg-brand-black text-brand-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                          {quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-sm font-semibold text-brand-black leading-snug break-words">{product.name}</p>
                        <p className="text-xs text-brand-gray mt-0.5 tabular-nums">
                          {formatPrice(singlePrice, country)} × {quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-beige-dark pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-gray">المجموع الفرعي</span>
                    <span className="text-brand-black tabular-nums">{formatPrice(subtotal, country)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-gray">التوصيل</span>
                    <span className="text-brand-gold-dark font-semibold">مجاني</span>
                  </div>
                  {method === "cod" && (
                    <div className="flex justify-between">
                      <span className="text-brand-gray">رسوم الدفع عند الاستلام</span>
                      <span className="text-brand-black tabular-nums">{formatPrice(codFee, country)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-3 border-t border-brand-beige-dark">
                    <span className="text-base font-bold text-brand-black">الإجمالي</span>
                    <span className="text-2xl font-bold text-brand-black tabular-nums">{formatPrice(total, country)}</span>
                  </div>
                </div>
              </div>

              {/* Trust / CRO block */}
              <div className="bg-brand-white rounded-2xl border border-brand-beige-dark p-5 shadow-[var(--shadow-luxe)] space-y-3">
                {[
                  { icon: ShieldCheck, text: "دفع آمن ومشفّر 100%" },
                  { icon: Truck, text: "توصيل مجاني لجميع دول الخليج" },
                  { icon: RotateCcw, text: "إرجاع سهل خلال 7 أيام" },
                  { icon: CheckCircle2, text: "منتجات أصلية بتركيزات حقيقية" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-brand-black/80">
                    <Icon className="w-4 h-4 text-brand-gold-dark shrink-0" strokeWidth={2} />
                    {text}
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-3 border-t border-brand-beige-dark">
                  <span className="flex gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                    ))}
                  </span>
                  <span className="text-xs text-brand-gray">4.9/5 — أكثر من 2,347 عميلة في الخليج</span>
                </div>
              </div>

              {/* Submit (mobile, under summary) */}
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="lg:hidden w-full bg-brand-black text-brand-white text-base font-semibold py-4 rounded-full transition-all duration-300 hover:bg-brand-gold active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
              >
                {isSubmitting
                  ? "جاري المعالجة..."
                  : method === "cod"
                  ? `تأكيد الطلب — ${formatPrice(total, country)}`
                  : `المتابعة للدفع — ${formatPrice(total, country)}`}
              </button>

              <p className="text-center text-xs text-brand-gray flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" /> بياناتك محمية ولن تُشارك مع أي طرف
              </p>
            </aside>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </>
  );
}
