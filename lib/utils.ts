export function formatNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}
