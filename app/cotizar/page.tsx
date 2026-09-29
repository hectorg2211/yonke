import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote-form";
import { QuoteSwitcher } from "@/components/quote-switcher";

export const metadata: Metadata = {
  title: "Cotizar pieza de tractocamión en Tijuana",
  description:
    "Cotiza cabina, motor, transmisión y más partes de tractocamión en Yonke El Cuñado, Garita de Otay, Tijuana. Te contestamos por WhatsApp.",
};

export default function CotizarPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:grid-cols-12 md:px-8 md:py-20">
      <div className="md:col-span-5">
        <p className="stamp motion-stamp text-[11px] text-rust">Pieza</p>
        <h1 className="display motion-settle mt-4 text-7xl leading-none md:text-8xl lg:text-9xl">
          Cotizar
          <br />
          pieza
        </h1>
        <p className="motion-stamp motion-delay-2 mt-6 max-w-lg text-lg leading-8 text-steel">
          Dinos qué buscas. Te mandamos el precio por WhatsApp.
        </p>
        <div className="motion-stamp motion-delay-3 mt-8">
          <QuoteSwitcher active="pieza" />
        </div>
        <p className="motion-stamp motion-delay-4 mt-10 max-w-lg border-t border-line pt-8 text-sm leading-6 text-steel">
          Vendemos partes de tractocamión. Sin taller.
        </p>
      </div>

      <div className="border border-line bg-panel p-4 md:col-span-7 md:p-8">
        <p className="stamp text-[11px] text-rust">Solicitud</p>
        <p className="mt-2 text-sm text-steel">
          Elige la pieza y déjanos tu WhatsApp.
        </p>
        <div className="mt-8">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}