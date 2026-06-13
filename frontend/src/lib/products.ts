import productsMedia from "@/data/products-media.json";
import rawProducts from "@/data/products.json";

export interface Ingredient {
  name: string;
  concentration: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductBenefit {
  title: string;
  description: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  subtitle: string;
  tagline: string;
  hook: string;
  heroIngredient: string;
  description: string;
  longDescription: string;
  problem: string;
  image: string;
  images: ProductImage[];
  benefits: ProductBenefit[];
  ingredients: Ingredient[];
  format: string;
  badge: string;
  price: number;
  icon: string;
  gradient: string;
  accentColor: string;
  accentBg: string;
  badgeBg: string;
  howToUse: string[];
  freeFrom: string[];
}

type ProductsMediaMap = Record<
  string,
  { images?: ProductImage[]; benefits?: ProductBenefit[] }
>;

const GALLERY_SLOTS = [
  { file: "1-hero.webp", label: "المنتج على خلفية بيضاء" },
  { file: "2-usage.webp", label: "طريقة الاستخدام" },
  { file: "3-results.webp", label: "النتائج" },
  { file: "4-size.webp", label: "حجم العبوة" },
] as const;

/** Auto paths: public/images/{slug}/1-hero.webp … 4-size.webp */
export function buildLocalImages(raw: { slug: string; name: string }): ProductImage[] {
  return GALLERY_SLOTS.map(({ file, label }) => ({
    src: `/images/${raw.slug}/${file}`,
    alt: `${raw.name} — ${label}`,
  }));
}

function enrichProduct(raw: any): Product {
  const media = (productsMedia as ProductsMediaMap)[raw.slug];
  
  // Use images from media JSON if available, otherwise auto-build local paths
  const images = media?.images?.length
    ? media.images
    : buildLocalImages(raw);
    
  // Use benefits from media JSON if available, otherwise use empty array
  const benefits = media?.benefits ?? [];

  return {
    ...raw,
    images,
    benefits,
  };
}

export const products: Product[] = (rawProducts as any[]).map(enrichProduct);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCrossSells(currentSlug: string): Product[] {
  return products.filter((p) => p.slug !== currentSlug);
}

export function getPrimaryImage(product: Product): string {
  // If local images exist (not placeholders), use the first one, otherwise use the unsplash fallback
  return product.images[0]?.src ?? product.image;
}

export function getFallbackImage(slug: string): string {
  const raw = (rawProducts as any[]).find((p) => p.slug === slug);
  return raw?.image ?? "";
}
