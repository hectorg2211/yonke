"use client";

import { useState } from "react";
import {
  location,
  mapsDirectionsUrl,
  mapsEmbedUrl,
  mapsPinUrl,
  sites,
  type YardSite,
} from "@/lib/site";

export function LocationBlock() {
  const [activeId, setActiveId] = useState<YardSite["id"]>(sites[0].id);
  const active = sites.find((item) => item.id === activeId) ?? sites[0];

  return (
    <section id="ubicacion" className="scroll-mt-20 border-t border-line bg-asphalt">
      <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-12">
        <div className="flex flex-col justify-between gap-10 px-5 py-16 md:col-span-5 md:px-8 md:py-20">
          <div>
            <p className="stamp text-[11px] text-amber">Cómo llegar</p>
            <h2 className="display mt-4 text-7xl md:text-8xl">El patio</h2>
            <p className="mt-6 max-w-sm text-steel">
              Tres puntos en Mesa de Otay, a un lado de la garita. Aquí se
              vende la pieza para el tractocamión; el envío sale a toda la
              República.
            </p>
          </div>
          <div>
            <p className="stamp text-[11px] text-steel">Dirección</p>
            <p className="display mt-3 text-5xl text-cream">{location.street}</p>
            <p className="mt-2 text-cream">
              {location.neighborhood}
              <br />
              {location.city}, {location.state} {location.postal}
            </p>
            <div className="mt-8 grid gap-3">
              {sites.map((item, index) => {
                const selected = item.id === active.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    aria-pressed={selected}
                    className={`flex w-full items-center justify-between gap-4 border px-4 py-3 text-left ${
                      selected
                        ? "border-amber bg-panel"
                        : "border-line hover:border-amber"
                    }`}
                  >
                    <span>
                      <span className="stamp block text-[10px] text-amber">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-1 block text-cream">{item.label}</span>
                    </span>
                    <span className="stamp shrink-0 text-[10px] text-amber">
                      {selected ? "En mapa" : "Ver mapa"}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={mapsPinUrl(active.lat, active.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="stamp border border-amber bg-amber px-5 py-3 text-[11px] text-oil hover:bg-cream"
              >
                Abrir en Maps
              </a>
              <a
                href={mapsDirectionsUrl(active.lat, active.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="stamp border border-line px-5 py-3 text-[11px] text-cream hover:border-amber hover:text-amber"
              >
                Cómo llegar
              </a>
            </div>
          </div>
        </div>
        <div className="relative min-h-105 overflow-hidden border-t border-line bg-asphalt md:col-span-7 md:border-t-0 md:border-l">
          <iframe
            key={active.id}
            title={`Mapa de ${active.label}, Yonke El Cuñado`}
            src={mapsEmbedUrl(active.lat, active.lng)}
            className="yard-map-embed absolute inset-0 size-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="hazard pointer-events-none absolute inset-x-0 top-0 z-10 h-1.5" />
        </div>
      </div>
    </section>
  );
}
