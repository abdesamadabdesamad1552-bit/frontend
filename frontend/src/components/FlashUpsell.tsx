"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";
import {
  getFlashUpsellProductId,
  getFlashUpsellPrice,
  getSinglePrice,
  formatPrice,
} from "@/lib/pricing";

const COUNTDOWN_SECONDS = 15;

export default function FlashUpsell() {
  const { state, addUpsell, closeUpsell, clearCart, cartProductIds } = useCart();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  const upsellProductId = getFlashUpsellProductId(cartProductIds);
  const upsellProduct = upsellProductId
    ? products.find((p) => p.id === upsellProductId)
    : null;

  const handleDecline = useCallback(() => {
    closeUpsell();
    clearCart();
  }, [closeUpsell, clearCart]);

  useEffect(() => {
    if (!state.isUpsellOpen) {
      setCountdown(COUNTDOWN_SECONDS);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isUpsellOpen, handleDecline]);

  if (!state.isUpsellOpen || !upsellProduct) return null;

  const originalPrice = getSinglePrice(state.country);
  const upsellPrice = getFlashUpsellPrice(state.country);
  const savings = originalPrice - upsellPrice;

  function handleAccept() {
    addUpsell(upsellProduct!.id);
    clearCart();
  }

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-brand-white rounded-2xl max-w-md w-full overflow-hidden animate-bounce-in border border-brand-beige-dark shadow-2xl">
          <div className="bg-brand-gold px-6 py-4 text-center">
            <p className="text-brand-white font-bold text-lg">⚡ عرض خاص لك فقط!</p>
            <div className="mt-2 inline-flex items-center gap-2 bg-brand-white/20 rounded-full px-4 py-1">
              <span className="text-brand-white/90 text-sm">⏱️</span>
              <span className="text-brand-white font-bold text-lg tabular-nums">
                00:{countdown.toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="p-6 text-center">
            <div className="relative w-40 h-40 mx-auto rounded-xl overflow-hidden mb-4 border border-brand-beige-dark">
              <Image
                src={upsellProduct.image}
                alt={upsellProduct.name}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>

            <h3 className="text-lg font-bold text-brand-black mb-1">
              {upsellProduct.name}
            </h3>
            <p className="text-sm text-brand-gray mb-4">{upsellProduct.subtitle}</p>

            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-brand-gray line-through text-base">
                {formatPrice(originalPrice, state.country)}
              </span>
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(upsellPrice, state.country)}
              </span>
            </div>
            <p className="text-sm font-semibold text-emerald-600 mb-6">
              وفّري {formatPrice(savings, state.country)}!
            </p>

            <p className="text-xs text-brand-gray mb-6">
              هذا العرض ينتهي خلال ثوانٍ ولن يتكرر مرة أخرى
            </p>

            <button
              onClick={handleAccept}
              className="w-full bg-brand-gold text-brand-black text-base font-bold py-4 rounded-xl hover:bg-brand-gold-light transition-colors mb-3"
            >
              أضيفي لطلبي بـ {formatPrice(upsellPrice, state.country)} فقط!
            </button>

            <button
              onClick={handleDecline}
              className="w-full text-sm text-brand-gray hover:text-brand-black transition-colors py-2"
            >
              لا شكراً، أكملي طلبي ←
            </button>
          </div>

          <div className="h-1 bg-brand-beige">
            <div
              className="h-full bg-brand-gold transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / COUNTDOWN_SECONDS) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
