import type { CartItem } from "./cart-context";
import type { CountryCode } from "./pricing";
import { countries, normalizePhone } from "./pricing";

export interface OrderSnapshot {
  orderId: string;
  name: string;
  phone: string;
  country: CountryCode;
  items: CartItem[];
  total: number;
  currency: string;
  createdAt: string;
}

export const ORDER_SNAPSHOT_KEY = "naqa_order_snapshot";

export function storeOrderSnapshot(snapshot: OrderSnapshot): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ORDER_SNAPSHOT_KEY, JSON.stringify(snapshot));
}

export function getOrderSnapshot(): OrderSnapshot | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(ORDER_SNAPSHOT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OrderSnapshot;
  } catch {
    return null;
  }
}

export function formatPhoneDisplay(phone: string, country: CountryCode): string {
  const digits = normalizePhone(phone, country);
  if (country === "SA" || country === "AE") {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
}

export function formatCustomerName(name: string): string {
  const trimmed = name.trim();
  const first = trimmed.split(/\s+/)[0];
  return first || trimmed;
}

export function snapshotCurrencySymbol(country: CountryCode): string {
  return countries[country].currencySymbol;
}
