import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: `Esta ruta no existe en ${site.name}. Revisa el inventario o cotiza la pieza.`,
};

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="hazard h-2.5" aria-hidden />
      <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 py-12 md:grid-cols-12 md:gap-12 md:px-8 md:py-16">
        <div className="md:col-span-7">
          <p className="stamp motion-stamp text-[11px] text-rust">
            SKU 404 · No en piso
          </p>
          <h1 className="display motion-settle mt-4 text-[clamp(4rem,11vw,7.25rem)] text-cream">
            Pieza
            <br />
            no está
          </h1>
          <p className="motion-stamp motion-delay-2 mt-6 max-w-lg text-lg leading-8 text-steel">
            La ruta que pediste no existe, o la refacción ya salió del
            catálogo. Busca en inventario o cotiza lo que necesitas.
          </p>
          <div className="stagger-late mt-8 flex flex-wrap gap-3">
            <Link
              href="/inventario"
              className="stamp border border-rust bg-rust px-6 py-3 text-[12px] text-paper hover:bg-paper hover:text-ink"
            >
              Ver inventario
            </Link>
            <Link
              href="/cotizar"
              className="stamp border border-line bg-paper px-6 py-3 text-[12px] text-cream hover:border-rust hover:text-rust"
            >
              Cotizar una pieza
            </Link>
          </div>
        </div>

        <div className="md:col-span-5">
          <article className="motion-stamp motion-delay-3 border border-line bg-panel">
            <header className="flex items-center justify-between gap-4 border-b border-dashed border-line px-6 py-4">
              <p className="stamp text-[11px] text-steel">Orden de piso</p>
              <p className="stamp border border-amber px-2 py-1 text-[11px] text-amber">
                Falta
              </p>
            </header>
            <div className="px-6 py-6">
              <p className="stamp text-[11px] text-steel">Número</p>
              <p className="display mt-1 text-[clamp(5rem,12vw,7.5rem)] leading-none text-rust">
                404
              </p>
            </div>
            <dl className="grid border-t border-line text-sm">
              {[
                ["Pasillo", "Sin ubicación"],
                ["Existencia", "0"],
                ["Destino", "Inventario"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 border-b border-line px-6 py-3.5 last:border-b-0"
                >
                  <dt className="stamp text-[11px] text-steel">{label}</dt>
                  <dd className="text-right text-cream">{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
