"use client";

import { useCart } from "@/lib/cart-context";
import { formatPrice, getSinglePrice } from "@/lib/pricing";

interface AddToCartButtonProps {
  productId: number;
  className?: string;
  showPrice?: boolean;
  label?: string;
}

export default function AddToCartButton({
  productId,
  className = "",
  showPrice = false,
  label = "أضف للسلة",
}: AddToCartButtonProps) {
  const { addItem, state } = useCart();
  const price = getSinglePrice(state.country);

  return (
    <button
      onClick={() => addItem(productId)}
      className={`cursor-pointer rounded-lg bg-gold font-semibold text-[#0a0a0a] transition-colors hover:bg-gold-light ${className}`}
    >
      {showPrice ? `${label} — ${formatPrice(price, state.country)}` : label}
    </button>
  );
}
