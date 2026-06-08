"use client";

import { useCart } from "@/lib/cart-context";
import { formatPrice, getSinglePrice } from "@/lib/pricing";
import { motion } from "framer-motion";

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
}: AddToCartButtonProps) {
  const { addItem, state } = useCart();
  const price = getSinglePrice(state.country);

  return (
    <motion.button
      onClick={() => addItem(productId)}
      whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(212,168,83,0.15)" }}
      whileTap={{ scale: 0.96 }}
      className={`relative font-semibold rounded-lg bg-gold text-obsidian hover:bg-gold-light transition-colors cursor-pointer ${className}`}
    >
      {showPrice ? `${label} — ${formatPrice(price, state.country)}` : label}
    </motion.button>
  );
}
