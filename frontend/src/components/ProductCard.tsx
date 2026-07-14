import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/lib/products";
import { getPrimaryImage } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-brand-white rounded-2xl border border-brand-beige-dark overflow-hidden flex flex-col min-w-0 shadow-[var(--shadow-luxe)] transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-gold/40 hover:shadow-[var(--shadow-luxe-lg)]">
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden block bg-brand-beige"
      >
        <span className="absolute top-4 right-4 z-10 text-[10px] font-semibold tracking-[0.1em] px-3 py-1.5 rounded-full bg-brand-white/95 backdrop-blur-sm text-brand-black shadow-sm">
          {product.badge}
        </span>
        <Image
          src={getPrimaryImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </Link>

      <div className="p-5 sm:p-6 flex flex-col flex-1 min-w-0">
        <Link href={`/products/${product.slug}`} className="min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-brand-black mb-1.5 transition-colors group-hover:text-brand-gold-dark break-words">
            {product.name}
          </h3>
        </Link>
        <p className="text-[13px] font-medium text-brand-gold-dark mb-1.5 leading-relaxed break-words">
          {product.hook}
        </p>
        <p className="text-xs text-brand-gray mb-2.5 break-words">{product.subtitle}</p>
        <p className="text-sm text-brand-gray/90 mb-4 leading-relaxed flex-1 break-words">
          {product.description}
        </p>

        <div className="mb-5 min-w-0">
          <div className="flex flex-wrap gap-1.5">
            {product.ingredients.slice(0, 3).map((ing) => (
              <span
                key={ing.name}
                className="inline-flex items-center gap-1 text-[11px] bg-brand-beige border border-brand-beige-dark text-brand-black/75 px-2.5 py-1 rounded-full max-w-full break-words"
              >
                {ing.name}
                {ing.concentration && (
                  <span className="font-bold text-brand-gold-dark">
                    {ing.concentration}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-4 border-t border-brand-beige-dark min-w-0">
          <Link
            href={`/products/${product.slug}`}
            className="text-xs text-brand-black font-semibold underline underline-offset-4 decoration-brand-beige-dark hover:decoration-brand-gold transition-colors flex-shrink-0"
          >
            التفاصيل
          </Link>
          <AddToCartButton
            productId={product.id}
            label="أضف للسلة"
            className="text-[13px] font-semibold px-5 py-2.5 flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
