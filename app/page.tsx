import Image from "next/image";
import Link from "next/link";
import { LocationBlock } from "@/components/location-block";
import { ProductCard } from "@/components/product-card";
import { getCatalog } from "@/lib/catalog";
import { partFamilies, site } from "@/lib/site";

export default async function Home() {
  const featured = (await getCatalog()).slice(0, 3);
  return (
    <>
      <section className="relative isolate min-h-[34rem] overflow-hidden md:min-h-[88dvh]">
        <Image
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2400&q=80"
          alt="Tractocamión en el patio"
          fill
          priority
          className="object-cover object-[22%_center] grayscale -scale-x-100"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--oil)_0%,var(--oil)_46%,color-mix(in_srgb,var(--oil)_80%,transparent)_58%,color-mix(in_srgb,var(--oil)_30%,transparent)_72%,transparent_88%)] md:bg-[linear-gradient(to_right,var(--oil)_0%,var(--oil)_36%,color-mix(in_srgb,var(--oil)_72%,transparent)_50%,color-mix(in_srgb,var(--oil)_22%,transparent)_66%,transparent_84%)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-oil to-transparent md:h-28"
        />
        <div className="relative mx-auto flex min-h-[34rem] w-full max-w-7xl flex-col justify-end gap-8 px-5 py-12 md:min-h-[88dvh] md:gap-10 md:px-8 md:py-24">
          <div className="max-w-4xl">
            <p className="stamp max-w-sm text-[11px] leading-6 text-rust md:max-w-none">
              {site.city} · Mesa de Otay · Envíos a toda la República
            </p>
            <h1 className="display mt-5 text-[clamp(3.75rem,13vw,7.5rem)] text-cream md:text-[9rem] lg:text-[11rem]">
              Partes
              <br />
              de tracto
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-cream/80">
              Yonke de venta: cabinas, motores, focos, transmisiones y el resto
              del fierro para tractocamión. El cliente pide la pieza. Nosotros
              la mandamos.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
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
      </section>

      <section className="border-y border-line bg-asphalt">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-3 md:px-8">
          {[
            ["01", "Catálogo", "Piezas de tractocamión en el patio, listas para cotizar."],
            ["02", "Envío", "El cliente ordena. El yonke manda a toda la República."],
            ["03", "Cotizar", "Si no está en piso, se cotiza por año y tipo de pieza."],
          ].map(([code, title, copy]) => (
            <div key={code} className="flex gap-4">
              <span className="stamp text-rust">{code}</span>
              <div>
                <h2 className="display text-4xl">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-steel">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="stamp text-[11px] text-rust">En el patio ahora</p>
            <h2 className="display mt-3 text-7xl md:text-9xl">Inventario</h2>
          </div>
          <Link
            href="/inventario"
            className="stamp text-[11px] text-cream underline decoration-rust underline-offset-4 hover:text-rust"
          >
            Abrir catálogo
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <ProductCard key={item.handle} item={item} />
          ))}
        </div>
      </section>

      <section className="bg-asphalt">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 md:px-8">
          <div>
            <p className="stamp text-[11px] text-rust">Lo que se vende</p>
            <h2 className="display mt-3 text-7xl md:text-9xl">
              Solo
              <br />
              partes
            </h2>
            <p className="mt-6 max-w-md text-steel">
              No hay taller ni unidades completas. El yonke es refacción para
              tractocamión: lo que está en patio y lo que se puede traer.
            </p>
            <Link
              href="/inventario"
              className="stamp mt-8 inline-block border border-line px-5 py-3 text-[11px] text-cream hover:border-rust hover:text-rust"
            >
              Ver piezas
            </Link>
          </div>
          <ol className="grid gap-px bg-line">
            {partFamilies.map((family) => (
              <li key={family.code} className="flex gap-5 bg-panel p-6">
                <span className="stamp text-rust">{family.code}</span>
                <div>
                  <h3 className="display text-5xl">{family.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-steel">{family.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=2000&q=80"
          alt="Motor de tractocamión"
          fill
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-oil/85" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8">
          <p className="stamp text-[11px] text-rust">Cotización</p>
          <h2 className="display mt-4 max-w-3xl text-7xl md:text-9xl">
            Cabina, motor o pieza. El año decide el precio.
          </h2>
          <p className="mt-6 max-w-lg text-cream/75">
            Si la parte no está en el patio, se cotiza por tipo y año del
            tractocamión. Sin mecánica: solo la pieza.
          </p>
          <Link
            href="/cotizar"
            className="stamp mt-8 inline-block border border-rust bg-rust px-6 py-3 text-[12px] text-paper hover:bg-paper hover:text-ink"
          >
            Cotizar pieza
          </Link>
        </div>
      </section>

      <LocationBlock />
    </>
  );
}
