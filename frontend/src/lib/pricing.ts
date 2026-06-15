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
  },
};

export const DEFAULT_COUNTRY: CountryCode = "SA";

export function getCountry(code: CountryCode): CountryConfig {
  return countries[code];
}

export interface CartLineItem {
  productId: number;
  quantity: number;
  isUpsell?: boolean;
}

export function calculateItemsTotal(
  items: CartLineItem[],
  country: CountryCode
): number {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return calculateCartTotal(itemCount, country);
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

const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const EXT_ARABIC_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

const COUNTRY_CALLING_CODES: Record<CountryCode, string> = {
  SA: "966",
  AE: "971",
  KW: "965",
  QA: "974",
  BH: "973",
  OM: "968",
};

/** Normalize phone for GCC: Arabic digits, spaces, +966, etc. */
export function normalizePhone(phone: string, country: CountryCode): string {
  let digits = phone.trim().replace(/[\s\-().]/g, "");

  digits = digits.replace(/[٠-٩]/g, (ch) => String(ARABIC_INDIC_DIGITS.indexOf(ch)));
  digits = digits.replace(/[۰-۹]/g, (ch) => String(EXT_ARABIC_DIGITS.indexOf(ch)));
  digits = digits.replace(/[^\d+]/g, "");

  const callingCode = COUNTRY_CALLING_CODES[country];
  if (digits.startsWith(`+${callingCode}`)) {
    digits = digits.slice(callingCode.length + 1);
  } else if (digits.startsWith(callingCode)) {
    digits = digits.slice(callingCode.length);
  }

  if ((country === "SA" || country === "AE") && digits.length === 9 && !digits.startsWith("0")) {
    digits = `0${digits}`;
  }

  return digits;
}

export function validatePhone(phone: string, country: CountryCode): boolean {
  const config = countries[country];
  const digits = normalizePhone(phone, country);

  if (digits.length !== config.phoneDigits) return false;
  if (!/^\d+$/.test(digits)) return false;

  return config.phonePrefixes.some((prefix) => digits.startsWith(prefix));
}

export function getPhoneError(country: CountryCode): string {
  const config = countries[country];
  const prefixes = config.phonePrefixes.join(" أو ");
  return `الرجاء إدخال رقم جوال صحيح يبدأ بـ ${prefixes} (مثال: ${config.phoneExample})`;
}

export function formatPrice(amount: number, country: CountryCode): string {
  return `${amount} ${countries[country].currencySymbol}`;
}
