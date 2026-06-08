export type CountryCode = "SA" | "AE" | "KW" | "QA" | "BH" | "OM";

export interface CountryConfig {
  code: CountryCode;
  flag: string;
  nameAr: string;
  currency: string;
  currencySymbol: string;
  phonePlaceholder: string;
  phoneExample: string;
  phoneDigits: number;
  phonePrefixes: string[];
  pricing: {
    single: number;
    double: number;
    triple: number;
  };
  flashUpsellPrice: number;
}

export const countries: Record<CountryCode, CountryConfig> = {
  SA: {
    code: "SA",
    flag: "🇸🇦",
    nameAr: "السعودية",
    currency: "SAR",
    currencySymbol: "ر.س",
    phonePlaceholder: "05xxxxxxxx",
    phoneExample: "0512345678",
    phoneDigits: 10,
    phonePrefixes: ["05"],
    pricing: { single: 199, double: 279, triple: 349 },
    flashUpsellPrice: 99,
  },
  AE: {
    code: "AE",
    flag: "🇦🇪",
    nameAr: "الإمارات",
    currency: "AED",
    currencySymbol: "د.إ",
    phonePlaceholder: "05xxxxxxxx",
    phoneExample: "0501234567",
    phoneDigits: 10,
    phonePrefixes: ["05"],
    pricing: { single: 195, double: 275, triple: 340 },
    flashUpsellPrice: 95,
  },
  KW: {
    code: "KW",
    flag: "🇰🇼",
    nameAr: "الكويت",
    currency: "KWD",
    currencySymbol: "د.ك",
    phonePlaceholder: "xxxx xxxx",
    phoneExample: "51234567",
    phoneDigits: 8,
    phonePrefixes: ["5", "6", "9"],
    pricing: { single: 16, double: 22, triple: 28 },
    flashUpsellPrice: 8,
  },
  QA: {
    code: "QA",
    flag: "🇶🇦",
    nameAr: "قطر",
    currency: "QAR",
    currencySymbol: "ر.ق",
    phonePlaceholder: "xxxx xxxx",
    phoneExample: "55123456",
    phoneDigits: 8,
    phonePrefixes: ["3", "5", "6", "7"],
    pricing: { single: 195, double: 275, triple: 340 },
    flashUpsellPrice: 95,
  },
  BH: {
    code: "BH",
    flag: "🇧🇭",
    nameAr: "البحرين",
    currency: "BHD",
    currencySymbol: "د.ب",
    phonePlaceholder: "xxxx xxxx",
    phoneExample: "36001234",
    phoneDigits: 8,
    phonePrefixes: ["3"],
    pricing: { single: 20, double: 28, triple: 35 },
    flashUpsellPrice: 10,
  },
  OM: {
    code: "OM",
    flag: "🇴🇲",
    nameAr: "عمان",
    currency: "OMR",
    currencySymbol: "ر.ع",
    phonePlaceholder: "xxxx xxxx",
    phoneExample: "92345678",
    phoneDigits: 8,
    phonePrefixes: ["7", "9"],
    pricing: { single: 20, double: 28, triple: 35 },
    flashUpsellPrice: 10,
  },
};

export const DEFAULT_COUNTRY: CountryCode = "SA";

export function getCountry(code: CountryCode): CountryConfig {
  return countries[code];
}

export function calculateCartTotal(
  itemCount: number,
  country: CountryCode
): number {
  const { pricing } = countries[country];

  if (itemCount <= 0) return 0;

  let total = 0;
  let remaining = itemCount;

  while (remaining > 0) {
    if (remaining >= 3) {
      total += pricing.triple;
      remaining -= 3;
    } else if (remaining === 2) {
      total += pricing.double;
      remaining -= 2;
    } else {
      total += pricing.single;
      remaining -= 1;
    }
  }

  return total;
}

export function getSinglePrice(country: CountryCode): number {
  return countries[country].pricing.single;
}

export function getFlashUpsellPrice(country: CountryCode): number {
  return countries[country].flashUpsellPrice;
}

export function validatePhone(phone: string, country: CountryCode): boolean {
  const config = countries[country];
  const digits = phone.replace(/\s/g, "");

  if (digits.length !== config.phoneDigits) return false;
  if (!/^\d+$/.test(digits)) return false;

  return config.phonePrefixes.some((prefix) => digits.startsWith(prefix));
}

export function getPhoneError(country: CountryCode): string {
  const config = countries[country];
  const prefixes = config.phonePrefixes.join(" أو ");
  return `الرجاء إدخال رقم جوال صحيح يبدأ بـ ${prefixes} (مثال: ${config.phoneExample})`;
}

/**
 * Determines which product to show in the Flash Upsell based on cart contents.
 * Uses the priority ranking from the strategy: 1 > 4 > 2 > 5 > 3
 */
export function getFlashUpsellProductId(cartProductIds: number[]): number | null {
  if (cartProductIds.length >= 5) return null;

  const upsellPriority = [1, 4, 2, 5, 3];

  const upsellRules: Record<string, number> = {
    "1": 4,
    "2": 1,
    "3": 1,
    "4": 1,
    "5": 1,
    "1,2": 4,
    "1,3": 4,
    "1,4": 2,
    "3,5": 1,
  };

  const sorted = [...cartProductIds].sort((a, b) => a - b);
  const key = sorted.join(",");

  if (upsellRules[key]) return upsellRules[key];

  for (const id of upsellPriority) {
    if (!cartProductIds.includes(id)) return id;
  }

  return null;
}

export function formatPrice(amount: number, country: CountryCode): string {
  return `${amount} ${countries[country].currencySymbol}`;
}
