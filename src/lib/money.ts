/** Approximate FX, labelled as such in the UI. Order of magnitude from MAD market quotes. */
export const FX = {
  EUR_MAD: 10.85,
  USD_MAD: 9.95,
  USD_EUR: 0.917,
  asOf: "2026-11",
} as const;

export type Currency = "MAD" | "EUR" | "USD";

export function toMad(amount: number, currency: Currency): number {
  if (currency === "MAD") return amount;
  if (currency === "EUR") return amount * FX.EUR_MAD;
  return amount * FX.USD_MAD;
}

export function toEur(amount: number, currency: Currency): number {
  if (currency === "EUR") return amount;
  if (currency === "MAD") return amount / FX.EUR_MAD;
  return amount * FX.USD_EUR;
}

export function formatMad(n: number, locale: "fr" | "en"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-MA" : "en-US", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function formatEur(n: number, locale: "fr" | "en"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatNum(n: number, locale: "fr" | "en", digits = 0): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}
