"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";
import {
  getSinglePrice,
  formatPrice,
  validatePhone,
  normalizePhone,
  getPhoneError,
  getFlashUpsellProductId,
  countries,
} from "@/lib/pricing";
import { placeOrder } from "@/lib/checkout-flow";
import { getThankYouPath, storeLastOrderId } from "@/lib/order-redirect";

export default function CheckoutModal() {
  const router = useRouter();
  const {
    state,
    closeCheckout,
    openCheckout,
    openUpsell,
    resetFlow,
    setPendingCheckout,
    clearPendingCheckout,
    cartProductIds,
  } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  if (!state.isCheckoutOpen) return null;

  const cartProducts = state.items
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId)!,
    }))
    .filter((item) => item.product);

  const total = cartProducts.reduce((sum, { quantity, isUpsell }) => {
    const unit = isUpsell
      ? countries[state.country].flashUpsellPrice
      : getSinglePrice(state.country);
    return sum + unit * quantity;
  }, 0);

  const country = state.country;
  const countryConfig = countries[country];

  async function finalizeOrder(
    customerName: string,
    customerPhone: string,
    items = state.items
  ) {
    const orderId = await placeOrder(
      customerName,
      customerPhone,
      country,
      items
    );
    storeLastOrderId(orderId);
    resetFlow();
    router.push(getThankYouPath(orderId));
  }

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

    const normalizedPhone = normalizePhone(phone, country);
    const customerName = name.trim();

    try {
      const upsellProductId = getFlashUpsellProductId(cartProductIds);
      setPendingCheckout({ name: customerName, phone: normalizedPhone });
      closeCheckout();

      if (upsellProductId) {
        openUpsell();
      } else {
        await finalizeOrder(customerName, normalizedPhone);
      }
    } catch (err) {
      clearPendingCheckout();
      openCheckout();
      setApiError(
        err instanceof Error ? err.message : "حدث خطأ، يرجى المحاولة مرة أخرى"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={closeCheckout}
      />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-brand-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-brand-beige-dark shadow-xl pointer-events-auto">
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
                {cartProducts.map(({ product, quantity, isUpsell }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between text-sm gap-3"
                  >
                    <span className="text-brand-black min-w-0 break-words">
                      {product.name} × {quantity}
                    </span>
                    <span className="font-semibold text-brand-black flex-shrink-0">
                      {formatPrice(
                        (isUpsell
                          ? countryConfig.flashUpsellPrice
                          : getSinglePrice(state.country)) * quantity,
                        country
                      )}
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

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
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
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
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
