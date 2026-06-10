"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";
import {
  calculateCartTotal,
  getSinglePrice,
  formatPrice,
  validatePhone,
  getPhoneError,
  getFlashUpsellProductId,
  countries,
} from "@/lib/pricing";
import { submitOrder } from "@/lib/api";

export default function CheckoutModal() {
  const { state, closeCheckout, openUpsell, clearCart, totalItems, cartProductIds } =
    useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [apiError, setApiError] = useState("");

  if (!state.isCheckoutOpen) return null;

  const cartProducts = state.items
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId)!,
    }))
    .filter((item) => item.product);

  const total = calculateCartTotal(totalItems, state.country);
  const singlePrice = getSinglePrice(state.country);
  const country = state.country;
  const countryConfig = countries[country];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");

    const newErrors: { name?: string; phone?: string } = {};
    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = "الرجاء إدخال الاسم الكامل";
    }
    if (!validatePhone(phone, country)) {
      newErrors.phone = getPhoneError(country);
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
        setTimeout(() => {
          clearCart();
          setIsSuccess(false);
          closeCheckout();
        }, 4000);
      }
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "حدث خطأ، يرجى المحاولة مرة أخرى"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <>
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="bg-brand-white rounded-2xl max-w-md w-full p-8 text-center border border-brand-beige-dark shadow-xl">
            <span className="text-5xl block mb-4">✅</span>
            <h2 className="text-2xl font-bold text-brand-black mb-2">
              تم تأكيد طلبك بنجاح!
            </h2>
            {orderId && (
              <p className="text-sm text-brand-gold mb-2">رقم الطلب: {orderId}</p>
            )}
            <p className="text-brand-gray">سنتواصل معك قريباً لتأكيد التوصيل</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={closeCheckout}
      />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="bg-brand-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-brand-beige-dark shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-beige-dark">
            <h2 className="text-lg font-bold text-brand-black">إتمام الطلب</h2>
            <button
              onClick={closeCheckout}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-beige transition-colors text-brand-gray"
            >
              ✕
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            <div>
              <p className="text-sm font-bold text-brand-black mb-3">── ملخص الطلب ──</p>
              <div className="space-y-2">
                {cartProducts.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-brand-black">
                      {product.name} × {quantity}
                    </span>
                    <span className="font-semibold text-brand-black">
                      {formatPrice(singlePrice * quantity, country)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-brand-beige mt-3 pt-3 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-gray">التوصيل</span>
                  <span className="text-emerald-600 font-medium">مجاني</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-brand-black">الإجمالي</span>
                  <span className="text-xl font-bold text-brand-black">
                    {formatPrice(total, country)}
                  </span>
                </div>
              </div>
            </div>

            {apiError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm font-bold text-brand-black">── بيانات التوصيل ──</p>

              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-sm font-medium text-brand-black mb-1.5"
                >
                  الاسم الكامل
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: محمد أحمد"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name
                      ? "border-red-400 bg-red-50/50"
                      : "border-brand-beige-dark"
                  } bg-brand-white text-brand-black placeholder:text-brand-gray-light focus:outline-none focus:border-brand-gold transition-colors`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-sm font-medium text-brand-black mb-1.5"
                >
                  رقم الجوال
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={
                    state.country === "SA" || state.country === "AE"
                      ? "05xxxxxxxx"
                      : "xxxx xxxx"
                  }
                  dir="ltr"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.phone
                      ? "border-red-400 bg-red-50/50"
                      : "border-brand-beige-dark"
                  } bg-brand-white text-brand-black placeholder:text-brand-gray-light focus:outline-none focus:border-brand-gold transition-colors`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-black text-brand-white text-base font-bold py-4 rounded-xl hover:bg-brand-gold transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "جاري التأكيد..." : "تأكيد الطلب — الدفع عند الاستلام"}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-brand-gray">
                <span>🔒 بياناتك محمية</span>
                <span>✓ الدفع نقداً عند الاستلام</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
