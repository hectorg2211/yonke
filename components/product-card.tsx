import Image from "next/image";
import Link from "next/link";
import type { CatalogItem } from "@/lib/site";
import { productPath } from "@/lib/site";

export function ProductCard({
  item,
  compact = false,
}: {
  item: CatalogItem;
  compact?: boolean;
}) {
  return (
    <Link
      href={productPath(item.handle)}
      className="group flex flex-col border border-line bg-panel hover:border-amber"
    >
      <div
        className={`relative overflow-hidden ${compact ? "aspect-4/3" : "aspect-5/4"}`}
      >
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-linear-to-t from-oil/80 via-transparent to-transparent" />
        <span className="stamp absolute top-3 left-3 border border-amber/70 bg-oil/70 px-2 py-1 text-[10px] text-amber">
          {item.sku}
        </span>
        {item.variantId && !item.availableForSale ? (
          <span className="stamp absolute top-3 right-3 border border-line bg-oil/80 px-2 py-1 text-[10px] text-steel">
            Agotada
          </span>
        ) : null}
      </div>
      <div
        className={`flex flex-1 flex-col ${compact ? "gap-2 p-4" : "gap-3 p-5"}`}
      >
        <p className="stamp text-[10px] text-steel">{item.category}</p>
        <h3
          className={`display text-cream ${compact ? "text-2xl" : "text-4xl"}`}
        >
          {item.name}
        </h3>
        {compact ? null : <p className="text-sm text-steel">{item.note}</p>}
        <div
          className={`mt-auto flex items-end justify-between gap-3 ${compact ? "pt-2" : "pt-4"}`}
        >
          <p className="text-amber">{item.price}</p>
          <span className="stamp text-[10px] text-cream underline decoration-rust underline-offset-4 group-hover:text-amber">
            Ver pieza
          </span>
        </div>
      </div>
    </Link>
  );
}

