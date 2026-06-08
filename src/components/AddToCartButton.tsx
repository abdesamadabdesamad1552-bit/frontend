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

  const baseClasses =
    variant === "accent" && accentBg
      ? `${accentBg} text-white hover:opacity-90`
      : "bg-brand-black text-brand-white hover:bg-brand-gold";

  return (
    <button
      onClick={() => addItem(productId)}
      className={`font-semibold rounded-xl transition-all ${baseClasses} ${className}`}
    >
      {showPrice ? `${label} — ${formatPrice(price, state.country)}` : label}
    </button>
  );
}
