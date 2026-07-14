"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { products, getPrimaryImage } from "@/lib/products";
import {
  calculateCartTotal,
  getSinglePrice,
  formatPrice,
} from "@/lib/pricing";

export default function CartDrawer() {
  const {
    state,
    closeDrawer,
    increment,
    decrement,
    removeItem,
    addItem,
    openCheckout,
    totalItems,
    cartProductIds,
  } = useCart();

  if (!state.isDrawerOpen) return null;

  const cartProducts = state.items
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId)!,
    }))
    .filter((item) => item.product);

  const crossSells = products.filter((p) => !cartProductIds.includes(p.id));
  const total = calculateCartTotal(totalItems, state.country);
  const singlePrice = getSinglePrice(state.country);

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 left-0 z-50 w-full max-w-md bg-brand-white shadow-2xl flex flex-col animate-slide-in-left">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-beige-dark">
          <h2 className="text-lg font-bold text-brand-black">
            سلة التسوق
            {totalItems > 0 && (
              <span className="text-sm font-normal text-brand-gray mr-2">
                ({totalItems})
              </span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-beige transition-colors text-brand-gray"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cartProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <span className="text-5xl mb-4">🛒</span>
              <p className="text-brand-gray text-sm">سلتك فارغة</p>
              <button
                onClick={closeDrawer}
                className="mt-4 text-sm text-brand-black font-bold underline underline-offset-2"
              >
                تصفحي المنتجات
              </button>
            </div>
          ) : (
            <div className="px-6 py-4 space-y-4">
              {cartProducts.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-xl bg-brand-beige/50 border border-brand-beige-dark"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={getPrimaryImage(product)}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-brand-black truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-brand-gray">{product.subtitle}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-brand-black">
                        {formatPrice(singlePrice, state.country)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decrement(product.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-full border border-brand-beige-dark text-brand-gray hover:border-brand-gold text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold text-brand-black w-5 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => increment(product.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-full border border-brand-beige-dark text-brand-gray hover:border-brand-gold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-brand-gray-light hover:text-brand-black transition-colors self-start text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {crossSells.length > 0 && (
                <div className="pt-4 border-t border-brand-beige-dark">
                  <p className="text-sm font-bold text-brand-black mb-3">
                    ✦ أضيفي لطلبك
                  </p>
                  <div className="space-y-2">
                    {crossSells.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg border border-brand-beige-dark hover:border-brand-gold/30 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={getPrimaryImage(product)}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-brand-black truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-brand-gray">
                            {formatPrice(singlePrice, state.country)}
                          </p>
                        </div>
                        <button
                          onClick={() => addItem(product.id)}
                          className="text-xs font-bold text-brand-black border border-brand-gold/50 px-3 py-1.5 rounded-lg hover:bg-brand-gold hover:text-brand-white transition-colors flex-shrink-0"
                        >
                          أضف
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {cartProducts.length > 0 && (
          <div className="border-t border-brand-beige-dark px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-gray">المجموع</span>
              <span className="text-xl font-bold text-brand-black">
                {formatPrice(total, state.country)}
              </span>
            </div>
            <p className="text-xs text-brand-gold-dark flex items-center gap-1">
              ✓ توصيل مجاني
            </p>
            <button
              onClick={openCheckout}
              className="w-full bg-brand-black text-brand-white text-base font-semibold py-4 rounded-full transition-all duration-300 hover:bg-brand-gold active:scale-[0.98] flex items-center justify-center gap-2"
            >
              إتمام الطلب
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
            </button>
          </div>
        )}
      </div>
    </>
  );
}
