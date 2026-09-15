import { isLowStock, lowStockMessage } from "@/lib/stock";

const chipClass =
  "stamp inline-block border border-amber bg-amber px-2.5 py-1 text-[10px] text-ink";

export function LowStockNote({
  quantity,
  available,
  className = chipClass,
}: {
  quantity: number | null;
  available: boolean;
  className?: string;
}) {
  if (!isLowStock(quantity, available)) return null;

  return <p className={className}>{lowStockMessage(quantity)}</p>;
}
