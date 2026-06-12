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
    <div className="bg-brand-white rounded-2xl border border-brand-gold/30 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <span className="inline-block self-start text-xs font-bold bg-brand-gold/15 text-brand-gold px-3 py-1 rounded-full mb-4">
        {bundle.badge}
      </span>

      <h3 className="text-lg font-bold text-brand-black mb-2">{bundle.name}</h3>
      <p className="text-sm text-brand-gray mb-4 flex-1 leading-relaxed">
        {bundle.tagline}
      </p>

      <ul className="space-y-1.5 mb-5">
        {bundleProducts.map((p) => (
          <li key={p!.id} className="text-xs text-brand-black/80 flex items-center gap-2">
            <span className="text-brand-gold">✓</span>
            {p!.name}
          </li>
        ))}
      </ul>

      <div className="flex items-end justify-between mb-4 pt-4 border-t border-brand-beige-dark">
        <div>
          <p className="text-xl font-bold text-brand-black">
            {formatPrice(bundlePrice, country)}
          </p>
          {savings > 0 && (
            <p className="text-xs text-emerald-600 font-medium">
              وفّري {formatPrice(savings, country)}
            </p>
          )}
        </div>
        {savings > 0 && (
          <span className="text-xs text-brand-gray line-through">
            {formatPrice(fullPrice, country)}
          </span>
        )}
      </div>

      <button
        onClick={() => addBundle(bundle.productIds)}
        className="w-full bg-brand-black text-brand-white font-bold py-3.5 rounded-xl hover:bg-brand-gold transition-colors"
      >
        أضف الباقة للسلة
      </button>
    </div>
  );
}
