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
  icon?: string;
}

export interface ProductLanding {
  subheadline: string;
  reviews: { quote: string; author: string }[];
  imageWithText: { headline: string; paragraph: string };
  threeColumns: { title: string; desc: string; icon: string }[];
  comparison: {
    title: string;
    subtitle: string;
    features: { name: string; us: boolean; others: boolean }[];
  };
  testimonials: {
    headline: string;
    paragraph: string;
    stats: { percent: string; text: string }[];
  };
  faq: { q: string; a: string }[];
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
  landing?: ProductLanding;
}

type ProductsMediaMap = Record<
  string,
  { images?: ProductImage[]; benefits?: ProductBenefit[]; skipSlots?: string[]; landing?: ProductLanding }
>;

const GALLERY_SLOTS = [
  { file: "1-hero.webp", label: "المنتج على خلفية بيضاء" },
  { file: "2-usage.webp", label: "طريقة الاستخدام" },
  { file: "3-results.webp", label: "النتائج" },
  { file: "4-size.webp", label: "حجم العبوة" },
  { file: "5-packaging.webp", label: "التغليف والتفاصيل" },
] as const;

/** Auto paths: public/images/{slug}/1-hero.webp … 5-packaging.webp */
export function buildLocalImages(raw: { slug: string; name: string }): ProductImage[] {
  return GALLERY_SLOTS.map(({ file, label }) => ({
    src: `/images/${raw.slug}/${file}`,
    alt: `${raw.name} — ${label}`,
  }));
}

function enrichProduct(raw: any): Product {
  const media = (productsMedia as ProductsMediaMap)[raw.slug];
  const skip = new Set(media?.skipSlots ?? []);
  const images =
    media?.images ??
    buildLocalImages(raw).filter((img) => !skip.has(img.src.split("/").at(-1) ?? ""));
  const benefits = media?.benefits ?? [];
  const primaryImage = images[0]?.src ?? raw.image;
  const landing = media?.landing;

  return {
    ...raw,
    image: primaryImage,
    images,
    benefits,
    landing,
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
  return product.images[0]?.src ?? `/images/${product.slug}/1-hero.webp`;
}

export function getFallbackImage(slug: string): string {
  return `/images/${slug}/1-hero.webp`;
}
