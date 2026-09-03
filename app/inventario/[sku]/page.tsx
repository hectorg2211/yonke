import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import {
  catalog,
  getProductBySlug,
  relatedProducts,
} from "@/lib/site";

export async function generateStaticParams() {
  return catalog.map((item) => ({ sku: item.sku.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: PageProps<"/inventario/[sku]">): Promise<Metadata> {
  const { sku } = await params;
  const item = getProductBySlug(sku);

  if (!item) {
    return { title: "Pieza no encontrada" };
  }

  return {
    title: item.name,
    description: `${item.name} · ${item.sku}. ${item.details}`,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/inventario/[sku]">) {
  const { sku } = await params;
  const item = getProductBySlug(sku);

  if (!item) {
    notFound();
  }

  const related = relatedProducts(item);
  const facts = [
    ["SKU", item.sku],
    ["Familia", item.category],
    ["Condición", item.condition],
    ["Origen", item.origin],
    ["Existencia", item.stock],
    ["Compatibilidad", item.fit],
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
      <p className="stamp text-[11px] text-steel">
        <Link href="/inventario" className="hover:text-amber">
          Inventario
        </Link>
        <span className="mx-2 text-line">/</span>
        <span className="text-amber">{item.sku}</span>
      </p>

      <article className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="relative min-h-105 overflow-hidden border border-line bg-panel lg:col-span-7">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover grayscale"
          />
          <div className="absolute inset-0 bg-linear-to-t from-oil/70 via-transparent to-transparent" />
          <span className="stamp absolute top-4 left-4 border border-amber bg-oil/80 px-3 py-1 text-[11px] text-amber">
            {item.sku}
          </span>
        </div>

        <div className="flex flex-col lg:col-span-5">
          <p className="stamp text-[11px] text-amber">Pieza de tractocamión</p>
          <h1 className="display mt-3 text-6xl text-cream md:text-7xl">
            {item.name}
          </h1>
          <p className="mt-4 text-2xl text-amber">{item.price}</p>
          <p className="mt-5 leading-7 text-steel">{item.details}</p>

          <dl className="mt-8 grid gap-px bg-line">
            {facts.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[7.5rem_1fr] gap-4 bg-oil px-0 py-3 md:grid-cols-[8.5rem_1fr]"
              >
                <dt className="stamp text-[10px] text-steel">{label}</dt>
                <dd className="text-cream">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/importaciones"
              className="stamp border border-amber bg-amber px-6 py-3 text-[12px] text-oil hover:bg-cream"
            >
              Pedir esta pieza
            </Link>
            <Link
              href="/inventario"
              className="stamp border border-line px-6 py-3 text-[12px] text-cream hover:border-amber hover:text-amber"
            >
              Volver al catálogo
            </Link>
          </div>
          <p className="mt-4 text-sm text-steel">
            Vista previa visual. No hay compra en línea todavía: la pieza se
            confirma en el patio.
          </p>
        </div>
      </article>

      <section className="mt-20 border-t border-line pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="stamp text-[11px] text-amber">Más del patio</p>
            <h2 className="display mt-2 text-5xl">Otras piezas</h2>
          </div>
          <Link
            href="/inventario"
            className="stamp text-[11px] text-cream underline decoration-rust underline-offset-4 hover:text-amber"
          >
            Ver inventario
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((entry) => (
            <ProductCard key={entry.sku} item={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}
