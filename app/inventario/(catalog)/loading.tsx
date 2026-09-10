import { InventoryGridSkeleton } from "@/components/skeleton";

export default function InventarioLoading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-4 md:px-8 md:py-5">
      <div className="flex items-end justify-between gap-4">
        <h1 className="display text-3xl text-cream md:text-4xl">Inventario</h1>
        <p className="stamp pb-0.5 text-[11px] text-steel">Piezas</p>
      </div>
      <InventoryGridSkeleton />
    </div>
  );
}
