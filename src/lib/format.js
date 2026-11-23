const TAKA = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function taka(amount) {
  return `৳${TAKA.format(Math.round(amount))}`;
}

/** Compact form for dense spots like the cart badge. */
export function takaCompact(amount) {
  const value = Math.round(amount);
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return String(value);
}

export function discountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
