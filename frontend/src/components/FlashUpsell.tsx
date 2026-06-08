"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";
import { getFlashUpsellProductId, getFlashUpsellPrice, getSinglePrice, formatPrice } from "@/lib/pricing";
import { motion } from "framer-motion";
import { Zap, Timer, ArrowLeft } from "lucide-react";

const COUNTDOWN_SECONDS = 15;

export default function FlashUpsell() {
  const { state, addUpsell, closeUpsell, clearCart, cartProductIds } = useCart();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  const upsellProductId = getFlashUpsellProductId(cartProductIds);
  const upsellProduct = upsellProductId ? products.find((p) => p.id === upsellProductId) : null;

  const handleDecline = useCallback(() => { closeUpsell(); clearCart(); }, [closeUpsell, clearCart]);

  useEffect(() => {
    if (!state.isUpsellOpen) { setCountdown(COUNTDOWN_SECONDS); return; }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); handleDecline(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state.isUpsellOpen, handleDecline]);

  if (!state.isUpsellOpen || !upsellProduct) return null;

  const originalPrice = getSinglePrice(state.country);
  const upsellPrice = getFlashUpsellPrice(state.country);
  const savings = originalPrice - upsellPrice;

  function handleAccept() { addUpsell(upsellProduct!.id); clearCart(); }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-md" />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 250 }}
          className="bg-obsidian-surface rounded-2xl max-w-md w-full overflow-hidden border border-glass-border glow-gold-strong"
        >
          {/* Header */}
          <div className="relative overflow-hidden px-6 py-5 text-center border-b border-glass-border">
            <div className="absolute inset-0 bg-gradient-to-l from-gold/[0.06] via-aurora-violet/[0.03] to-gold/[0.06]" />
            <div className="relative">
              <p className="text-text-primary font-bold text-[16px] flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-gold fill-gold" />
                عرض خاص لك فقط!
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-white/[0.04] rounded-full px-4 py-1.5 border border-gold/10">
                <Timer className="w-3.5 h-3.5 text-gold/70" />
                <span className="text-gold font-bold text-[17px] tabular-nums">
                  00:{countdown.toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          <div className="p-7 text-center">
            <div className="relative w-36 h-36 mx-auto rounded-xl overflow-hidden mb-5 border border-glass-border glow-gold">
              <Image src={upsellProduct.image} alt={upsellProduct.name} fill sizes="144px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-surface/40 to-transparent" />
            </div>

            <h3 className="text-[16px] font-bold text-text-primary mb-1">{upsellProduct.name}</h3>
            <p className="text-[12px] text-text-faint mb-5">{upsellProduct.subtitle}</p>

            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-text-faint line-through text-[14px]">{formatPrice(originalPrice, state.country)}</span>
              <span className="text-[22px] font-bold text-gold">{formatPrice(upsellPrice, state.country)}</span>
            </div>
            <p className="text-[13px] font-semibold text-aurora-violet mb-6">
              وفّري {formatPrice(savings, state.country)}!
            </p>

            <p className="text-[11px] text-text-faint mb-6">هذا العرض ينتهي خلال ثوانٍ ولن يتكرر</p>

            <motion.button
              onClick={handleAccept}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gold text-obsidian text-[14px] font-bold py-3.5 rounded-xl hover:bg-gold-light transition-colors mb-3 glow-gold"
            >
              أضيفي لطلبي بـ {formatPrice(upsellPrice, state.country)} فقط!
            </motion.button>

            <button onClick={handleDecline} className="w-full text-[12px] text-text-faint hover:text-text-muted transition-colors py-2 flex items-center justify-center gap-1">
              لا شكراً، أكملي طلبي
              <ArrowLeft className="w-3 h-3" />
            </button>
          </div>

          {/* Progress */}
          <div className="h-0.5 bg-obsidian-elevated">
            <motion.div
              className="h-full bg-gradient-to-l from-gold to-aurora-violet"
              initial={{ width: "100%" }}
              animate={{ width: `${(countdown / COUNTDOWN_SECONDS) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}
