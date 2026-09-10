import { InventoryGridSkeleton } from "@/components/skeleton";

export default function InventarioLoading() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-5 py-5 md:px-8 md:py-8">
      <div className="flex items-end justify-between gap-4">
        <h1 className="display text-4xl text-cream md:text-5xl">Inventario</h1>
        <p className="stamp pb-0.5 text-[11px] text-steel">Piezas</p>
      </div>
      <InventoryGridSkeleton />
    </div>
  );
}
