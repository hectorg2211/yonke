import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { InventoryPagination } from "@/components/inventory-pagination";
import { hasActiveFilters, type InventoryPage, type InventoryQuery } from "@/lib/inventory";

export function InventoryResults({
  query,
  page,
}: {
  query: InventoryQuery;
  page: InventoryPage;
}) {
  if (page.total === 0) {
    return (
      <div
        id="inventario-resultados"
        className="mt-5 border border-line bg-panel px-6 py-12 text-center"
      >
        <p className="display text-5xl text-cream">Sin coincidencias</p>
        <p className="mx-auto mt-3 max-w-md text-steel">
          {hasActiveFilters(query)
            ? "No hay piezas con esos filtros. Prueba otro SKU o limpia la búsqueda."
            : "No hay piezas en el inventario."}
        </p>
        {hasActiveFilters(query) ? (
          <Link
            href="/inventario"
            className="stamp mt-6 inline-block border border-amber bg-amber px-5 py-2.5 text-[12px] text-oil hover:bg-cream"
          >
            Ver todo el inventario
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div id="inventario-resultados" className="mt-5 scroll-mt-24">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {page.items.map((item) => (
            <ProductCard key={item.handle} item={item} compact />
        ))}
      </div>
      <InventoryPagination query={query} page={page} />
    </div>
  );
}
