"use client";

import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";
import type { Bundle } from "@/lib/bundles";
import {
  calculateCartTotal,
  formatPrice,
  getSinglePrice,
} from "@/lib/pricing";

export default function BundleCard({ bundle }: { bundle: Bundle }) {
  const { addBundle, state } = useCart();
  const country = state.country;

  const bundleProducts = bundle.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const itemCount = bundle.productIds.length;
  const bundlePrice = calculateCartTotal(itemCount, country);
  const fullPrice = itemCount * getSinglePrice(country);
  const savings = fullPrice - bundlePrice;

  return (
    <div className="bg-brand-white rounded-2xl border border-brand-beige-dark p-7 flex flex-col h-full shadow-[var(--shadow-luxe)] transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-gold/40 hover:shadow-[var(--shadow-luxe-lg)]">
      <span className="inline-block self-start text-[11px] font-semibold tracking-[0.1em] bg-brand-gold/10 text-brand-gold-dark px-3 py-1.5 rounded-full mb-5">
        {bundle.badge}
      </span>

      <h3 className="text-lg font-bold text-brand-black mb-2">{bundle.name}</h3>
      <p className="text-sm text-brand-gray mb-5 flex-1 leading-[1.8]">
        {bundle.tagline}
      </p>

      <ul className="space-y-2 mb-6">
        {bundleProducts.map((p) => (
          <li key={p!.id} className="text-[13px] text-brand-black/80 flex items-center gap-2.5">
            <span className="text-brand-gold" aria-hidden>✓</span>
            {p!.name}
          </li>
        ))}
      </ul>

      <div className="flex items-end justify-between mb-5 pt-5 border-t border-brand-beige-dark">
        <div>
          <p className="text-2xl font-bold text-brand-black tabular-nums">
            {formatPrice(bundlePrice, country)}
          </p>
          {savings > 0 && (
            <p className="text-xs text-brand-gold-dark font-semibold mt-0.5">
              وفّري {formatPrice(savings, country)}
            </p>
          )}
        </div>
        {savings > 0 && (
          <span className="text-sm text-brand-gray line-through tabular-nums">
            {formatPrice(fullPrice, country)}
          </span>
        )}
      </div>

      <button
        onClick={() => addBundle(bundle.productIds)}
        className="w-full bg-brand-black text-brand-white font-semibold py-4 rounded-full transition-all duration-300 hover:bg-brand-gold active:scale-[0.98]"
      >
        أضف الباقة للسلة
      </button>
    </div>
  );
}
