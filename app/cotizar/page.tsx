import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote-form";
import { QuoteSwitcher } from "@/components/quote-switcher";

export const metadata: Metadata = {
  title: "Cotizar pieza",
  description:
    "Cotiza una pieza de tractocamión: tipo, año, modelo, serie, marca y si la buscan nueva o usada.",
};

export default function CotizarPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:grid-cols-12 md:px-8 md:py-20">
      <div className="md:col-span-5">
        <p className="stamp text-[11px] text-rust">Cotización</p>
        <h1 className="display mt-4 text-7xl leading-none md:text-8xl lg:text-9xl">
          Cotizar
          <br />
          la pieza
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-steel">
          Cuatro pasos en el celular: qué buscan, datos de la unidad, una foto
          si la tienen, y WhatsApp. El patio arma el precio; no sale automático.
        </p>
        <div className="mt-8">
          <QuoteSwitcher active="pieza" />
        </div>
        <dl className="mt-10 grid gap-6 border-t border-line pt-8">
          <div>
            <dt className="stamp text-[11px] text-steel">Alcance</dt>
            <dd className="mt-2 text-cream">
              Partes de tractocamión. El vendedor cotiza; el precio se puede
              negociar. No se venden unidades completas ni servicio de taller.
            </dd>
          </div>
        </dl>
      </div>

      <div className="border border-line bg-panel p-6 md:col-span-7 md:p-8">
        <p className="stamp text-[11px] text-rust">Paso a paso</p>
        <p className="mt-2 text-sm text-steel">
          La cotización sale por WhatsApp para que el patio la revise.
        </p>
        <div className="mt-8">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}