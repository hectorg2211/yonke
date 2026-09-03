import Image from "next/image";
import Link from "next/link";
import type { CatalogItem } from "@/lib/site";
import { productPath } from "@/lib/site";

export function ProductCard({ item }: { item: CatalogItem }) {
  return (
    <Link
      href={productPath(item.sku)}
      className="group flex flex-col border border-line bg-panel"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
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
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="stamp text-[10px] text-steel">{item.category}</p>
        <h3 className="display text-4xl text-cream">{item.name}</h3>
        <p className="text-sm text-steel">{item.note}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="text-amber">{item.price}</p>
          <span className="stamp text-[10px] text-cream underline decoration-rust underline-offset-4 group-hover:text-amber">
            Ver pieza
          </span>
        </div>
      </div>
    </Link>
  );
}
