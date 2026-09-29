import type { Metadata } from "next";
import { FacturaNote } from "@/components/factura-note";
import { ImportQuoteForm } from "@/components/import-quote-form";
import { QuoteSwitcher } from "@/components/quote-switcher";

export const metadata: Metadata = {
  title: "Cotizar importación de tractocamión en Tijuana",
  description:
    "Cotiza la importación de cabina, motor o camión en Yonke El Cuñado, Garita de Otay, Tijuana. Te mandamos el precio por WhatsApp.",
};

export default function ImportacionesPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:grid-cols-12 md:px-8 md:py-20">
      <div className="md:col-span-5">
        <p className="stamp motion-stamp text-[11px] text-rust">Importación</p>
        <h1 className="display motion-settle mt-4 text-6xl leading-none md:text-7xl lg:text-8xl">
          Cotizar
          <br />
          importación
        </h1>
        <p className="motion-stamp motion-delay-2 mt-6 max-w-lg text-lg leading-8 text-steel">
          Dinos qué vas a traer. Te mandamos el precio por WhatsApp.
        </p>
        <div className="motion-stamp motion-delay-3 mt-8">
          <QuoteSwitcher active="importacion" />
        </div>
        <p className="motion-stamp motion-delay-4 mt-10 max-w-lg border-t border-line pt-8 text-sm leading-6 text-steel">
          Con marca, modelo y año cotizamos más rápido.
        </p>
        <FacturaNote
          when="when"
          className="motion-stamp motion-delay-4 mt-4 max-w-lg"
        />
      </div>

      <div className="border border-line bg-panel p-4 md:col-span-7 md:p-8">
        <p className="stamp text-[11px] text-rust">Solicitud</p>
        <p className="mt-2 text-sm text-steel">
          Elige la carga y déjanos tu WhatsApp.
        </p>
        <div className="mt-8">
          <ImportQuoteForm />
        </div>
      </div>
    </div>
  );
}