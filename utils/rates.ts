let cachedRates: any = null;
let lastFetchTime = 0;

export async function getRates(base: string) {
  const now = Date.now();

  if (cachedRates && now - lastFetchTime < 10 * 60 * 1000) {
    return cachedRates;
  }

  const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
  const data = await res.json();

  cachedRates = data.rates;
  lastFetchTime = now;

  return cachedRates;
}
