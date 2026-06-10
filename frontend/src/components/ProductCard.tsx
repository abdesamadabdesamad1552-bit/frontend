import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-brand-white rounded-2xl border border-brand-beige-dark hover:border-brand-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/5 overflow-hidden flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden block"
      >
        <span
          className={`absolute top-4 right-4 z-10 text-xs font-semibold px-3 py-1 rounded-full ${product.badgeBg}`}
        >
          {product.badge}
        </span>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${product.gradient} opacity-30`} />
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-bold text-brand-black mb-1 group-hover:text-brand-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-brand-gray mb-2">{product.subtitle}</p>
        <p className="text-sm text-brand-black/70 mb-4 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {product.ingredients.slice(0, 3).map((ing) => (
              <span
                key={ing.name}
                className="inline-flex items-center gap-1 text-xs bg-brand-beige text-brand-black/80 px-2.5 py-1 rounded-full"
              >
                {ing.name}
                {ing.concentration && (
                  <span className={`font-bold ${product.accentColor}`}>
                    {ing.concentration}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-brand-beige">
          <Link
            href={`/products/${product.slug}`}
            className="text-xs text-brand-gold font-semibold hover:underline"
          >
            التفاصيل
          </Link>
          <AddToCartButton
            productId={product.id}
            label="أضف للسلة"
            variant="accent"
            accentBg={product.accentBg}
            className="text-sm px-5 py-2.5"
          />
        </div>
      </div>
    </div>
  );
}
