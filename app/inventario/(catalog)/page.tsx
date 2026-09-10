import type { Metadata } from "next";
import { InventoryToolbar } from "@/components/inventory-toolbar";
import { InventoryResults } from "@/components/inventory-results";
import { getCatalog, searchCatalog } from "@/lib/catalog";
import { catalogFamilies, parseInventoryQuery } from "@/lib/inventory";

export async function generateMetadata({
  searchParams,
}: PageProps<"/inventario">): Promise<Metadata> {
  const query = parseInventoryQuery(await searchParams);
  if (query.q) {
    return {
      title: `Inventario · ${query.q}`,
      description: `Búsqueda de partes de tractocamión: ${query.q}.`,
    };
  }
  if (query.familia) {
    return {
      title: `Inventario · ${query.familia}`,
      description: `Catálogo de ${query.familia.toLowerCase()} para tractocamión.`,
    };
  }
  return {
    title: "Inventario",
    description:
      "Catálogo de partes para tractocamión: cabinas, motores, focos, transmisiones y más.",
  };
}

export default async function InventarioPage({
  searchParams,
}: PageProps<"/inventario">) {
  const query = parseInventoryQuery(await searchParams);
  const [catalog, page] = await Promise.all([
    getCatalog(),
    searchCatalog(query),
  ]);
  const families = catalogFamilies(catalog);

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-5 py-5 md:px-8 md:py-8">
      <div className="flex items-end justify-between gap-4">
        <h1 className="display text-4xl text-cream md:text-5xl">Inventario</h1>
        <p className="stamp pb-0.5 text-[11px] text-steel">
          {page.total}
          {page.truncated ? "+" : ""} pieza{page.total === 1 ? "" : "s"}
        </p>
      </div>

      <InventoryToolbar query={query} families={families} />

      <InventoryResults query={query} page={page} />
    </div>
  );
}
