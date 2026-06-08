"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";
import { calculateCartTotal, getSinglePrice, formatPrice } from "@/lib/pricing";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, ArrowLeft, Sparkles } from "lucide-react";

export default function CartDrawer() {
  const {
    state, closeDrawer, increment, decrement, removeItem,
    addItem, openCheckout, totalItems, cartProductIds,
  } = useCart();

  if (!state.isDrawerOpen) return null;

  const cartProducts = state.items
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId)! }))
    .filter((item) => item.product);

  const crossSells = products.filter((p) => !cartProductIds.includes(p.id));
  const total = calculateCartTotal(totalItems, state.country);
  const singlePrice = getSinglePrice(state.country);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 left-0 z-50 w-full max-w-md bg-obsidian-light border-r border-glass-border shadow-2xl flex flex-col animate-slide-in-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-glass-border">
          <h2 className="text-[15px] font-bold text-text-primary flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-gold/60" strokeWidth={1.5} />
            سلة التسوق
            {totalItems > 0 && (
              <span className="text-[12px] font-normal text-text-faint mr-1">({totalItems})</span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/[0.04] transition-colors text-text-muted"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {cartProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-glass-border flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-text-faint" strokeWidth={1.5} />
              </div>
              <p className="text-[13px] text-text-muted mb-3">سلتك فارغة</p>
              <button onClick={closeDrawer} className="text-[12px] text-gold/70 font-medium hover:text-gold transition-colors">
                تصفحي المنتجات
              </button>
            </div>
          ) : (
            <div className="px-6 py-5 space-y-4">
              <AnimatePresence>
                {cartProducts.map(({ product, quantity, isUpsell }) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="flex gap-4 p-3 rounded-xl bg-obsidian-surface border border-glass-border"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-semibold text-text-primary truncate">{product.name}</h3>
                      <p className="text-[11px] text-text-faint">{product.subtitle}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[13px] font-bold text-gold">
                          {isUpsell
                            ? formatPrice(
                                state.country === "SA" ? 99 : state.country === "AE" ? 95 : state.country === "KW" ? 8 : state.country === "QA" ? 95 : 10,
                                state.country
                              )
                            : formatPrice(singlePrice, state.country)}
                          {isUpsell && <span className="text-[10px] text-aurora-violet mr-1">عرض</span>}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => decrement(product.id)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white/[0.03] border border-glass-border text-text-muted hover:border-gold/20 hover:text-gold transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[12px] font-semibold text-text-primary w-4 text-center">{quantity}</span>
                          <button onClick={() => increment(product.id)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white/[0.03] border border-glass-border text-text-muted hover:border-gold/20 hover:text-gold transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeItem(product.id)} className="text-text-faint hover:text-red-400 transition-colors self-start mt-1">
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {crossSells.length > 0 && (
                <div className="pt-5 border-t border-glass-border">
                  <p className="text-[12px] font-semibold text-text-muted mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-gold/50" />
                    أضيفي لطلبك
                  </p>
                  <div className="space-y-2">
                    {crossSells.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-obsidian-surface border border-glass-border hover:border-gold/10 transition-colors">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={product.image} alt={product.name} fill sizes="40px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-text-primary truncate">{product.name}</p>
                          <p className="text-[10px] text-text-faint">{formatPrice(singlePrice, state.country)}</p>
                        </div>
                        <button onClick={() => addItem(product.id)} className="text-[10px] font-semibold text-gold/70 border border-gold/15 px-2.5 py-1 rounded-md hover:bg-gold hover:text-obsidian transition-colors flex-shrink-0">
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

        {/* Footer */}
        {cartProducts.length > 0 && (
          <div className="border-t border-glass-border px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-muted">المجموع</span>
              <span className="text-[20px] font-bold text-gold">{formatPrice(total, state.country)}</span>
            </div>
            <p className="text-[10px] text-gold/50 flex items-center gap-1">✓ توصيل مجاني</p>
            <motion.button
              onClick={openCheckout}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gold text-obsidian text-[14px] font-bold py-3.5 rounded-xl hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
            >
              إتمام الطلب
              <ArrowLeft className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        )}
      </div>
    </>
  );
}
