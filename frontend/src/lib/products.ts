export interface Ingredient {
  name: string;
  concentration: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  subtitle: string;
  tagline: string;
  description: string;
  longDescription: string;
  problem: string;
  image: string;
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

export const products: Product[] = [
  {
    id: 1,
    name: "نقاء سيروم الإشراق",
    slug: "radiance-serum",
    subtitle: "سيروم فيتامين سي والنياسيناميد",
    tagline: "توحيد لون البشرة وإزالة التصبغات",
    description: "لتوحيد لون البشرة وإزالة التصبغات والبقع الداكنة",
    longDescription:
      "سيروم مائي خفيف بتركيبة علمية متقدمة تستهدف التصبغات والبقع الداكنة وعدم توحد لون البشرة. فيتامين سي مستقر (Ethyl Ascorbic Acid) لا يتأكسد في حرارة الخليج — مصمم خصيصاً لمناخك.",
    problem: "تعبتِ من التصبغات اللي ما تروح؟",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop&q=80",
    ingredients: [
      { name: "فيتامين سي مستقر", concentration: "10%" },
      { name: "نياسيناميد", concentration: "5%" },
      { name: "ألفا أربوتين", concentration: "2%" },
      { name: "حمض الهيالورونيك", concentration: "" },
    ],
    format: "سيروم مائي خفيف — زجاجة قطّارة زجاجية 30ml",
    badge: "الأكثر مبيعاً",
    price: 199,
    icon: "✨",
    gradient: "from-amber-50 to-orange-50",
    accentColor: "text-amber-700",
    accentBg: "bg-amber-700",
    badgeBg: "bg-amber-100 text-amber-800",
    howToUse: [
      "نظفي وجهك جيداً وجففيه",
      "ضعي 3-4 قطرات على الوجه والرقبة",
      "دلّكي بلطف بحركات دائرية حتى يمتص بالكامل",
      "استخدميه صباحاً ومساءً للحصول على أفضل النتائج",
    ],
    freeFrom: ["هيدروكينون", "كورتيزون", "عطور صناعية", "بارابين"],
  },
  {
    id: 2,
    name: "نقاء قناع النضارة الذهبي",
    slug: "glow-mask",
    subtitle: "قناع الببتيدات وحمض الهيالورونيك",
    tagline: "نضارة فورية ومكافحة علامات التقدم",
    description: "للنضارة الفورية ومكافحة علامات التقدم في السن",
    longDescription:
      "قناع ليلي فاخر بببتيدات الجيل الثالث و3 أوزان من حمض الهيالورونيك. حطيه قبل النوم — صبّحي ببشرة مختلفة. نتائج مرئية من أول استخدام.",
    problem: "بشرتك فقدت نضارتها؟",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop&q=80",
    ingredients: [
      { name: "ببتيدات الجيل الثالث", concentration: "" },
      { name: "حمض الهيالورونيك", concentration: "3 أوزان" },
      { name: "مستخلص الحلزون", concentration: "" },
      { name: "سينتيلا آسياتيكا", concentration: "" },
    ],
    format: "قناع ليلي — وعاء زجاجي 50g مع ملعقة ذهبية",
    badge: "فاخر",
    price: 199,
    icon: "👑",
    gradient: "from-yellow-50 to-amber-50",
    accentColor: "text-yellow-700",
    accentBg: "bg-yellow-700",
    badgeBg: "bg-yellow-100 text-yellow-800",
    howToUse: [
      "ضعي طبقة سخية على الوجه والرقبة بعد تنظيف البشرة",
      "اتركيه طوال الليل — لا حاجة للغسل",
      "في الصباح اغسلي بالماء الفاتر",
      "استخدميه 3-4 مرات أسبوعياً",
    ],
    freeFrom: ["هيدروكينون", "كورتيزون", "عطور صناعية", "كحول"],
  },
  {
    id: 3,
    name: "نقاء سيروم تكثيف الشعر",
    slug: "hair-density-serum",
    subtitle: "سيروم الريدنسيل والكافيين",
    tagline: "وقف التساقط وتعزيز الكثافة",
    description: "لوقف التساقط وتعزيز كثافة الشعر وتقوية البصيلات",
    longDescription:
      "سيروم مائي خفيف بتركيبة ريدنسيل 3% + كافيين — المكونات اللي أثبتت الدراسات فعاليتها. مو زيت دهني. يُمتص بسرعة بدون بقايا. 97% لاحظوا تحسن في الحجم خلال 90 يوم.",
    problem: "شعرك يتساقط أكثر من المعتاد؟",
    image:
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&h=800&fit=crop&q=80",
    ingredients: [
      { name: "ريدنسيل", concentration: "3%" },
      { name: "كافيين", concentration: "2%" },
      { name: "بيوتين + زنك PCA", concentration: "" },
      { name: "زيت بذور اليقطين", concentration: "" },
    ],
    format: "سيروم مائي خفيف — زجاجة 50ml برأس قطّارة إبري",
    badge: "للنساء والرجال",
    price: 199,
    icon: "💆",
    gradient: "from-emerald-50 to-teal-50",
    accentColor: "text-emerald-700",
    accentBg: "bg-emerald-700",
    badgeBg: "bg-emerald-100 text-emerald-800",
    howToUse: [
      "وزعي السيروم على فروة الرأس الجافة أو الرطبة",
      "استخدمي الرأس الإبري لتوصيل السيروم للجذور مباشرة",
      "دلّكي فروة الرأس بأطراف أصابعك لمدة 2-3 دقائق",
      "لا تغسلي — استخدمي يومياً صباحاً أو مساءً",
    ],
    freeFrom: ["مينوكسيديل", "سيليكون", "كبريتات", "بارابين"],
  },
  {
    id: 4,
    name: "نقاء كريم العيون بالريتينول",
    slug: "eye-retinol-cream",
    subtitle: "كريم الريتينول والكافيين",
    tagline: "للهالات السوداء والانتفاخ وخطوط العين",
    description: "للهالات السوداء والانتفاخ وخطوط محيط العين",
    longDescription:
      "تركيبة خماسية متخصصة لمحيط العين: ريتينالديهايد + كافيين 3% + هالوكسيل 2% + فيتامين ك + ببتيد Eyeseryl. مع رأس تطبيق معدني بارد — تحسين الفرق من أول مرة.",
    problem: "الهالات السوداء ما تروح بالكونسيلر؟",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop&q=80",
    ingredients: [
      { name: "ريتينالديهايد", concentration: "0.05%" },
      { name: "كافيين", concentration: "3%" },
      { name: "هالوكسيل", concentration: "2%" },
      { name: "ببتيد Eyeseryl", concentration: "" },
    ],
    format: "كريم غني — أنبوب معدني 15ml برأس تطبيق معدني بارد",
    badge: "متخصص",
    price: 199,
    icon: "👁️",
    gradient: "from-violet-50 to-purple-50",
    accentColor: "text-violet-700",
    accentBg: "bg-violet-700",
    badgeBg: "bg-violet-100 text-violet-800",
    howToUse: [
      "ضعي كمية صغيرة (بحجم حبة الأرز) على أطراف أصابعك",
      "ربّتي بلطف حول محيط العين — من الزاوية الداخلية للخارجية",
      "استخدمي الرأس المعدني البارد للتدليك اللطيف",
      "استخدميه مساءً قبل النوم",
    ],
    freeFrom: ["عطور صناعية", "كحول", "بارابين", "ملونات صناعية"],
  },
  {
    id: 5,
    name: "نقاء جل الصفاء",
    slug: "clarity-gel",
    subtitle: "جل حمض الساليسيليك والزنك",
    tagline: "تنقية المسام ومكافحة الشوائب",
    description: "لتنقية المسام ومكافحة الشوائب والتحكم بالدهون",
    longDescription:
      "جل خفيف شفاف بحمض الساليسيليك 2% + زنك PCA — ينقي المسام من الداخل ويقلل الإفرازات الدهنية بدون ما يجفف بشرتك. يُمتص بثوانٍ — بدون لمعان. بشرة أصفى من أول أسبوع.",
    problem: "بشرتك دهنية ومساماتك واسعة؟",
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&h=800&fit=crop&q=80",
    ingredients: [
      { name: "حمض الساليسيليك", concentration: "2%" },
      { name: "زنك PCA", concentration: "1%" },
      { name: "زيت شجرة الشاي", concentration: "" },
      { name: "نياسيناميد", concentration: "4%" },
    ],
    format: "جل شفاف — زجاجة مضخة مثلجة (frosted) 30ml",
    badge: "الأكثر طلباً",
    price: 199,
    icon: "💎",
    gradient: "from-sky-50 to-cyan-50",
    accentColor: "text-sky-700",
    accentBg: "bg-sky-700",
    badgeBg: "bg-sky-100 text-sky-800",
    howToUse: [
      "ضعي طبقة رقيقة على البشرة النظيفة الجافة",
      "ركزي على مناطق المسام الواسعة (الأنف، الخدود، الجبهة)",
      "لا تغسلي — جل leave-on يعمل طوال اليوم أو الليل",
      "استخدميه مرة أو مرتين يومياً",
    ],
    freeFrom: ["كحول مجفف", "عطور صناعية", "زيوت معدنية", "بارابين"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCrossSells(currentSlug: string): Product[] {
  return products.filter((p) => p.slug !== currentSlug);
}
