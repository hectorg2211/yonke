import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cotizar",
  description:
    "Cotizador visual de partes para tractocamión: cabinas, motores y refacciones.",
};

const kinds = ["Cabina", "Motor", "Transmisión", "Espejo", "Focos", "Pieza general"];

export default function ImportacionesPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:grid-cols-12 md:px-8 md:py-20">
      <div className="md:col-span-6">
        <p className="stamp text-[11px] text-amber">YC-COT · Pieza</p>
        <h1 className="display mt-4 text-7xl md:text-8xl">
          Cotizar
          <br />
          la pieza
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-steel">
          Solo partes de tractocamión. Cabina, motor, transmisión o la
          refacción que falte. El precio cambia con el año. Esta pantalla es
          vitrina; la cifra real llega por WhatsApp.
        </p>
        <dl className="mt-10 grid gap-6 border-t border-line pt-8">
          <div>
            <dt className="stamp text-[11px] text-steel">Ejemplo de patio</dt>
            <dd className="mt-2 display text-5xl text-cream">Cabina 1,500 USD</dd>
            <p className="mt-2 text-sm text-steel">
              Base de 2005. Otro año, otra cifra.
            </p>
          </div>
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
        <p className="stamp text-[11px] text-amber">Formulario visual</p>
        <p className="mt-2 text-sm text-steel">
          Sin envío. Solo para ver cómo se pide la pieza.
        </p>
        <form className="mt-8 grid gap-6" aria-label="Cotizador de piezas">
          <label className="grid gap-2">
            <span className="stamp text-[11px] text-steel">Tipo de pieza</span>
            <select
              disabled
              defaultValue="Cabina"
              className="h-12 border border-line bg-oil px-3 text-cream disabled:opacity-90"
            >
              {kinds.map((kind) => (
                <option key={kind}>{kind}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="stamp text-[11px] text-steel">Año del tracto</span>
            <input
              disabled
              defaultValue="2005"
              className="h-12 border border-line bg-oil px-3 text-cream disabled:opacity-90"
            />
          </label>
          <label className="grid gap-2">
            <span className="stamp text-[11px] text-steel">Qué se busca</span>
            <textarea
              disabled
              rows={4}
              defaultValue="Cabina para tractocamión, sin golpe estructural."
              className="border border-line bg-oil px-3 py-3 text-cream disabled:opacity-90"
            />
          </label>
          <div className="border border-amber/40 bg-oil p-5">
            <p className="stamp text-[10px] text-steel">Estimado de vitrina</p>
            <p className="display mt-2 text-6xl text-amber">1,500 USD</p>
            <p className="mt-2 text-sm text-steel">
              Cifra de muestra. La real sale con el año y la pieza.
            </p>
          </div>
          <button
            type="button"
            className="stamp h-12 border border-amber bg-amber text-[12px] text-oil hover:bg-cream"
          >
            Pedir cotización real
          </button>
        </form>
      </div>
    </div>
  );
}
