import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111111] transition-colors hover:border-gold/20">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
        <span className="absolute top-4 right-4 rounded-full border border-gold/20 bg-black/40 px-3 py-1 text-[10px] font-medium text-gold backdrop-blur-sm">
          {product.badge}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="mb-1 text-[17px] font-semibold text-white transition-colors group-hover:text-gold">
            {product.name}
          </h3>
        </Link>
        <p className="mb-3 text-[13px] text-white/50">{product.subtitle}</p>
        <p className="mb-5 flex-1 text-[13px] leading-relaxed text-white/40">{product.tagline}</p>

        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
          <Link
            href={`/products/${product.slug}`}
            className="text-[12px] font-medium text-gold/80 transition-colors hover:text-gold"
          >
            التفاصيل
          </Link>
          <AddToCartButton productId={product.id} label="أضف للسلة" className="text-[12px] px-4 py-2" />
        </div>
      </div>
    </article>
  );
}
