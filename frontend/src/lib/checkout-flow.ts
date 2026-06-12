import { submitOrder } from "./api";
import type { CartItem } from "./cart-context";
import {
  calculateItemsTotal,
  countries,
  type CountryCode,
} from "./pricing";

export async function placeOrder(
  name: string,
  phone: string,
  country: CountryCode,
  items: CartItem[]
): Promise<string> {
  const countryConfig = countries[country];
  const total = calculateItemsTotal(items, country);

  const result = await submitOrder({
    name: name.trim(),
    phone,
    country,
    items: items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      isUpsell: i.isUpsell,
    })),
    total,
    currency: countryConfig.currency,
  });

  return result.orderId;
}
