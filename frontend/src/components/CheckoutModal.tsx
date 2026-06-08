"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";
import { calculateCartTotal, getSinglePrice, formatPrice, validatePhone, getPhoneError, getFlashUpsellProductId, countries } from "@/lib/pricing";
import { submitOrder } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CheckCircle, Truck, AlertCircle } from "lucide-react";

export default function CheckoutModal() {
  const { state, closeCheckout, openUpsell, clearCart, totalItems, cartProductIds } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [apiError, setApiError] = useState("");

  if (!state.isCheckoutOpen) return null;

  const cartProducts = state.items
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId)! }))
    .filter((item) => item.product);

  const total = calculateCartTotal(totalItems, state.country);
  const singlePrice = getSinglePrice(state.country);
  const country = state.country;
  const countryConfig = countries[country];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");

    const newErrors: { name?: string; phone?: string } = {};
    if (!name.trim() || name.trim().length < 3) newErrors.name = "الرجاء إدخال الاسم الكامل";
    if (!validatePhone(phone, country)) newErrors.phone = getPhoneError(country);
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await submitOrder({
        name: name.trim(),
        phone: phone.trim(),
        country,
        items: state.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          isUpsell: i.isUpsell,
        })),
        total,
        currency: countryConfig.currency,
      });

      setOrderId(result.orderId);

      const upsellProductId = getFlashUpsellProductId(cartProductIds);
      if (upsellProductId) {
        openUpsell();
      } else {
        setIsSuccess(true);
        setTimeout(() => { clearCart(); setIsSuccess(false); closeCheckout(); }, 4000);
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <>
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md" />
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-obsidian-surface rounded-2xl max-w-md w-full p-10 text-center border border-glass-border glow-gold-strong"
          >
            <div className="w-14 h-14 rounded-full bg-gold/[0.08] flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-7 h-7 text-gold" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">تم تأكيد طلبك بنجاح!</h2>
            {orderId && (
              <p className="text-[13px] text-gold/70 font-mono mb-2">رقم الطلب: {orderId}</p>
            )}
            <p className="text-[14px] text-text-muted">سنتواصل معك قريباً لتأكيد التوصيل</p>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md" onClick={closeCheckout} />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="bg-obsidian-surface rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-glass-border glow-gold"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-glass-border">
            <h2 className="text-[15px] font-bold text-text-primary">إتمام الطلب</h2>
            <button onClick={closeCheckout} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/[0.04] transition-colors text-text-muted">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Summary */}
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-text-faint font-medium mb-3">ملخص الطلب</p>
              <div className="space-y-2">
                {cartProducts.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between text-[13px]">
                    <span className="text-text-muted">{product.name} × {quantity}</span>
                    <span className="font-semibold text-text-primary">{formatPrice(singlePrice * quantity, country)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-glass-border mt-3 pt-3 space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-text-faint">التوصيل</span>
                  <span className="text-gold/70 font-medium flex items-center gap-1">
                    <Truck className="w-3 h-3" />مجاني
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-text-primary">الإجمالي</span>
                  <span className="text-[20px] font-bold text-gold">{formatPrice(total, country)}</span>
                </div>
              </div>
            </div>

            {/* API Error */}
            {apiError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/[0.06] border border-red-500/15 text-[12px] text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {apiError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-[11px] tracking-[0.15em] uppercase text-text-faint font-medium">بيانات التوصيل</p>

              <div>
                <label htmlFor="checkout-name" className="block text-[12px] font-medium text-text-muted mb-1.5">الاسم الكامل</label>
                <input
                  id="checkout-name" type="text" value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: محمد أحمد"
                  className={`w-full px-4 py-3 rounded-xl bg-obsidian-elevated border ${errors.name ? "border-red-400/30" : "border-glass-border"} text-text-primary text-[14px] placeholder:text-text-faint focus:outline-none focus:border-gold/30 transition-colors`}
                />
                {errors.name && <p className="text-[11px] text-red-400/80 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="checkout-phone" className="block text-[12px] font-medium text-text-muted mb-1.5">رقم الجوال</label>
                <input
                  id="checkout-phone" type="tel" value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={state.country === "SA" ? "05xxxxxxxx" : state.country === "AE" ? "05xxxxxxxx" : "xxxx xxxx"}
                  dir="ltr"
                  className={`w-full px-4 py-3 rounded-xl bg-obsidian-elevated border ${errors.phone ? "border-red-400/30" : "border-glass-border"} text-text-primary text-[14px] placeholder:text-text-faint focus:outline-none focus:border-gold/30 transition-colors`}
                />
                {errors.phone && <p className="text-[11px] text-red-400/80 mt-1">{errors.phone}</p>}
              </div>

              <motion.button
                type="submit" disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-gold text-obsidian text-[14px] font-bold py-3.5 rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "جاري التأكيد..." : "تأكيد الطلب — الدفع عند الاستلام"}
              </motion.button>

              <div className="flex items-center justify-center gap-5 text-[10px] text-text-faint">
                <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-gold/40" />بياناتك محمية</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-gold/40" />الدفع نقداً</span>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
