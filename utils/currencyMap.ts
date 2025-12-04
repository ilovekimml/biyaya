export const countryToCurrency: Record<string, string> = {
  PH: "PHP",
  AE: "AED",
  US: "USD",
  SG: "SGD",
  HK: "HKD",
  JP: "JPY",
  KR: "KRW",
  UK: "GBP",
  EU: "EUR",
};

export function getCurrencyForCountry(code: string) {
  return countryToCurrency[code] || "USD";
}
