import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { catalog, categories } from "@/lib/site";

export const metadata: Metadata = {
  title: "Inventario",
  description:
    "Catálogo visual de partes para tractocamión: cabinas, motores, focos, transmisiones y más.",
};

export default function InventarioPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <p className="stamp text-[11px] text-amber">YC-INV · Carga progresiva</p>
      <h1 className="display mt-4 text-7xl md:text-9xl">Inventario</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-steel">
        El patio no tiene todo contabilizado. Esta vitrina se llena de a poco
        con partes de tractocamión: primero lo que se mueve, después el resto
        del yonke.
      </p>

      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <span
            key={category}
            className={`stamp border px-3 py-2 text-[10px] ${
              index === 0
                ? "border-amber bg-amber text-oil"
                : "border-line text-steel"
            }`}
          >
            {category}
          </span>
        ))}
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.map((item) => (
          <ProductCard key={item.sku} item={item} />
        ))}
      </div>
    </div>
  );
}
