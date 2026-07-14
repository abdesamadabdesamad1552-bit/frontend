import type { CartItem } from "@/lib/cart-context";
import { calculateItemsTotal, getCodFee, type CountryCode } from "@/lib/pricing";

export type PaymentMethod = "card" | "apple_pay" | "tabby" | "tamara" | "cod";

interface RecomputeInput {
  items: CartItem[];
  country: CountryCode;
  method: PaymentMethod;
}

/**
 * The ONLY place order totals are computed for payment purposes. Never trust
 * a client-supplied amount — always derive it from the cart + country pricing
 * table, exactly like the existing checkout flow does for COD.
 */
export function recomputeServerTotal({ items, country, method }: RecomputeInput): number {
  if (!items?.length) {
    throw new Error("Cart is empty");
  }
  const subtotal = calculateItemsTotal(items, country);
  const fee = method === "cod" ? getCodFee(country) : 0;
  return subtotal + fee;
}

/**
 * Soft-verify the client-sent amount against the server total. We never use
 * the client value to charge — this only lets us reject obviously-tampered
 * requests early with a clear error instead of silently overcharging/undercharging.
 */
export function assertAmountMatches(clientAmount: unknown, serverAmount: number): void {
  if (typeof clientAmount !== "number" || !Number.isFinite(clientAmount)) return;
  if (Math.abs(clientAmount - serverAmount) > 0.01) {
    throw new Error(
      `Amount mismatch: client sent ${clientAmount}, server computed ${serverAmount}`
    );
  }
}
