import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote-form";

export const metadata: Metadata = {
  title: "Cotizar",
  description:
    "Cotiza partes para tractocamión: cabinas, motores y refacciones.",
};

export default function ImportacionesPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:grid-cols-12 md:px-8 md:py-20">
      <div className="md:col-span-6">
        <p className="stamp text-[11px] text-amber">Cotización</p>
        <h1 className="display mt-4 text-8xl md:text-9xl">
          Cotizar
          <br />
          la pieza
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-steel">
          Solo partes de tractocamión. Cabina, motor, transmisión o la
          refacción que falte. El precio cambia con el año. La cotización sale
          por WhatsApp.
        </p>
        <dl className="mt-10 grid gap-6 border-t border-line pt-8">
          <div>
            <dt className="stamp text-[11px] text-steel">Alcance</dt>
            <dd className="mt-2 text-cream">
              Partes de tractocamión. No se venden unidades completas ni
              servicio de taller.
            </dd>
          </div>
        </dl>
      </div>

      <div className="border border-line bg-panel p-6 md:col-span-6 md:p-8">
        <p className="stamp text-[11px] text-amber">Datos de la pieza</p>
        <p className="mt-2 text-sm text-steel">
          Cuéntanos qué buscas y te respondemos por WhatsApp.
        </p>
        <div className="mt-8">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}
