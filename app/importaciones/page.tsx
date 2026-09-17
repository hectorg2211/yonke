import type { Metadata } from "next";
import { ImportQuoteForm } from "@/components/import-quote-form";
import { QuoteSwitcher } from "@/components/quote-switcher";

export const metadata: Metadata = {
  title: "Cotizar importación",
  description:
    "Cotiza una importación de tractocamión: mercancía, marca, modelo, año, transporte y si va completo o por partes.",
};

export default function ImportacionesPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:grid-cols-12 md:px-8 md:py-20">
      <div className="md:col-span-5">
        <p className="stamp text-[11px] text-rust">Importación</p>
        <h1 className="display mt-4 text-6xl leading-none md:text-7xl lg:text-8xl">
          Cotizar
          <br />
          importación
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-steel">
          Cuatro pasos: mercancía, si va completo o cortado, transporte y
          WhatsApp. El patio confirma el monto; la aduana puede mover el precio.
        </p>
        <div className="mt-8">
          <QuoteSwitcher active="importacion" />
        </div>
        <dl className="mt-10 grid gap-6 border-t border-line pt-8">
          <div>
            <dt className="stamp text-[11px] text-steel">Qué se pide</dt>
            <dd className="mt-2 text-cream">
              Marca, modelo, año, tipo de mercancía, transporte y si se
              presenta armada. Una foto evita cruzar cabina con camión
              completo.
            </dd>
          </div>
        </dl>
      </div>

      <div className="border border-line bg-panel p-6 md:col-span-7 md:p-8">
        <p className="stamp text-[11px] text-rust">Paso a paso</p>
        <p className="mt-2 text-sm text-steel">
          Recolectamos lo que el patio necesita y lo mandamos por WhatsApp.
        </p>
        <div className="mt-8">
          <ImportQuoteForm />
        </div>
      </div>
    </div>
  );
}