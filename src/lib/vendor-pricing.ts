/** Parse advertised ZAR prices without joining the two ends of a range together. */
export function parseVendorPriceRange(value: unknown): { min: number; max: number } | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const text = String(value).trim();
  if (/^free$/i.test(text)) return { min: 0, max: 0 };
  const matches = [...text.matchAll(/(\d{1,3}(?:[,\.\s]\s*\d{3})+(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*([km])?\b/gi)];
  if (!matches.length || matches.length > 2) return null;
  const amounts = matches.map(match => {
    // Grouped thousands can use commas, dots, or spaces; cents use two digits.
    const compact = match[1].replace(/\s/g, '');
    const decimal = compact.match(/[.,](\d{1,2})$/);
    const whole = decimal ? compact.slice(0, decimal.index) : compact;
    const number = Number(whole.replace(/[.,]/g, '') + (decimal ? `.${decimal[1]}` : ''));
    const suffix = match[2]?.toLowerCase();
    return { number, scale: suffix === 'm' ? 1_000_000 : suffix === 'k' ? 1_000 : 1, suffix };
  });
  // Common shorthand: "R5–10k". Do not scale an already complete "R5000–10k".
  if (amounts.length === 2 && !amounts[0].suffix && amounts[1].suffix && amounts[0].number < 1_000) {
    amounts[0].scale = amounts[1].scale;
  }
  const prices = amounts.map(amount => amount.number * amount.scale);
  if (prices.some(price => !Number.isFinite(price) || price < 0)) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Card prices and slider values use thousands of rand. Default means no price filter. */
export function matchesVendorBudget(
  vendor: { price: number; priceMax?: number; priceKnown?: boolean },
  budget: number[],
  defaultMaximum: number
): boolean {
  if (budget[0] === 0 && budget[1] === defaultMaximum) return true;
  if (vendor.priceKnown === false) return false;
  const maximum = budget[1] === defaultMaximum ? Infinity : budget[1];
  return vendor.price <= maximum && (vendor.priceMax ?? vendor.price) >= budget[0];
}
