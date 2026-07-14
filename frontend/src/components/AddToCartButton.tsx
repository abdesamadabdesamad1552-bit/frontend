"use client";

import { useCart } from "@/lib/cart-context";
import { formatPrice, getSinglePrice } from "@/lib/pricing";

interface AddToCartButtonProps {
  productId: number;
  className?: string;
  showPrice?: boolean;
  label?: string;
  variant?: "primary" | "accent";
  accentBg?: string;
}

export default function AddToCartButton({
  productId,
  className = "",
  showPrice = false,
  label = "أضف للسلة",
  variant = "primary",
  accentBg,
}: AddToCartButtonProps) {
  const { addItem, state } = useCart();
  const price = getSinglePrice(state.country);

  // Unified luxury style: black → gold on hover (accent/accentBg kept for
  // backward compatibility but no longer drives the color, to keep the
  // palette to black / gold / neutrals across every product.)
  void variant;
  void accentBg;

  return (
    <button
      onClick={() => addItem(productId)}
      className={`bg-brand-black text-brand-white font-semibold rounded-full transition-all duration-300 hover:bg-brand-gold active:scale-[0.98] ${className}`}
    >
      {showPrice ? `${label} — ${formatPrice(price, state.country)}` : label}
    </button>
  );
}
