export const LOW_STOCK_MAX = 5;

export function isLowStock(
  quantity: number | null | undefined,
  available: boolean,
): quantity is number {
  return available && quantity != null && quantity > 0 && quantity <= LOW_STOCK_MAX;
}

export function lowStockMessage(quantity: number): string {
  return quantity === 1 ? "Queda 1" : `Quedan ${quantity}`;
}
