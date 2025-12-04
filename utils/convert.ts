import { getRates } from "./rates";

export async function convertCurrency(amount: number, from: string, to: string) {
  if (from === to) return amount;

  const rates = await getRates(from);
  const rate = rates[to];

  if (!rate) return amount;

  return amount * rate;
}
