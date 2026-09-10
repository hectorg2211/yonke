import Image from "next/image";
import Link from "next/link";
import { isCustomerAccountConfigured } from "@/lib/shopify/env";
import { location, nav, site } from "@/lib/site";

export function Footer() {
  const accountEnabled = isCustomerAccountConfigured();

  return (
    <footer className="border-t border-line bg-asphalt">
      <div className="hazard h-2" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <Image
            src="/assets/logo.png"
            alt={site.name}
            width={1363}
            height={294}
            className="h-16 w-auto max-w-80 object-contain object-left md:h-20 md:max-w-xl"
          />
          <p className="mt-5 max-w-sm text-steel">
            Venta de partes para tractocamión. Inventario de patio y envíos a
            toda la República. Sin taller.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="stamp text-[11px] text-steel">Rutas</p>
          <ul className="mt-4 grid gap-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-cream hover:text-amber">
                  {item.label}
                </Link>
              </li>
            ))}
            {accountEnabled ? (
              <li>
                <Link href="/cuenta" className="text-cream hover:text-amber">
                  Cuenta
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="stamp text-[11px] text-steel">Patio</p>
          <p className="mt-4 text-cream">
            {location.street}
            <br />
            {location.neighborhood}
            <br />
            {location.city}, {location.state} {location.postal}
          </p>
          <p className="mt-3 text-cream">{site.email}</p>
          <a
            href={location.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="stamp mt-4 inline-block text-[11px] text-amber underline decoration-rust underline-offset-4 hover:text-cream"
          >
            Ver en Google Maps
          </a>
        </div>
      </div>
      <div className="border-t border-line px-5 py-4 text-[12px] text-steel md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <span className="stamp">{site.name}</span>
          <span>Inventario en carga progresiva · Vista previa visual</span>
        </div>
      </div>
    </footer>
  );
}
