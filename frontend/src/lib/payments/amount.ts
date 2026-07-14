/** Currencies whose minor unit is 1/1000 (3 decimal places) instead of 1/100. */
const THREE_DECIMAL_CURRENCIES = new Set(["KWD", "BHD", "OMR"]);

export function getCurrencyDecimals(currency: string): number {
  return THREE_DECIMAL_CURRENCIES.has(currency.toUpperCase()) ? 3 : 2;
}

/** Stripe (and most card processors) want an integer in the smallest unit. */
export function toMinorUnits(currency: string, majorAmount: number): number {
  const factor = 10 ** getCurrencyDecimals(currency);
  return Math.round(majorAmount * factor);
}

/** Tabby / Tamara want major-unit decimal strings, e.g. "199.00". */
export function toMajorDecimalString(currency: string, majorAmount: number): string {
  return majorAmount.toFixed(getCurrencyDecimals(currency));
}
