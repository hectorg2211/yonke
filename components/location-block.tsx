import { location } from "@/lib/site";

export function LocationBlock() {
  const address = `${location.street}, ${location.neighborhood}, ${location.postal} ${location.city}, ${location.state}`;

  return (
    <section id="ubicacion" className="scroll-mt-20 border-t border-line bg-asphalt">
      <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-12">
        <div className="flex flex-col justify-between gap-10 px-5 py-16 md:col-span-5 md:px-8 md:py-20">
          <div>
            <p className="stamp text-[11px] text-amber">YC-MAP · Cómo llegar</p>
            <h2 className="display mt-4 text-6xl md:text-7xl">El patio</h2>
            <p className="mt-6 max-w-sm text-steel">
              Mesa de Otay, a un lado de la garita. Aquí se vende la pieza para
              el tractocamión; el envío sale a toda la República.
            </p>
          </div>
          <address className="not-italic">
            <p className="stamp text-[11px] text-steel">Dirección</p>
            <p className="display mt-3 text-4xl text-cream">{location.street}</p>
            <p className="mt-2 text-cream">
              {location.neighborhood}
              <br />
              {location.city}, {location.state} {location.postal}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="stamp border border-amber bg-amber px-5 py-3 text-[11px] text-oil hover:bg-cream"
              >
                Abrir en Maps
              </a>
              <a
                href={location.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="stamp border border-line px-5 py-3 text-[11px] text-cream hover:border-amber hover:text-amber"
              >
                Cómo llegar
              </a>
            </div>
          </address>
        </div>
        <div className="relative min-h-105 border-t border-line md:col-span-7 md:border-t-0 md:border-l">
          <iframe
            title={`Mapa de Yonke El Cuñado, ${address}`}
            src={location.embedUrl}
            className="absolute inset-0 size-full grayscale contrast-125"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="hazard pointer-events-none absolute inset-x-0 top-0 h-1.5" />
        </div>
      </div>
    </section>
  );
}
