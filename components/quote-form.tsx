"use client";

import { useState, type FormEvent } from "react";
import { whatsappUrl } from "@/lib/site";

const kinds = ["Cabina", "Motor", "Transmisión", "Espejo", "Focos", "Pieza general"];

export function QuoteForm() {
  const [kind, setKind] = useState("Cabina");
  const [year, setYear] = useState("");
  const [note, setNote] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lines = [
      "Hola, quiero cotizar una pieza.",
      `Tipo: ${kind}`,
      year.trim() ? `Año: ${year.trim()}` : null,
      note.trim() ? `Detalle: ${note.trim()}` : null,
    ].filter(Boolean);
    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="grid gap-6" aria-label="Cotizador de piezas" onSubmit={onSubmit}>
      <label className="grid gap-2">
        <span className="stamp text-[11px] text-steel">Tipo de pieza</span>
        <select
          value={kind}
          onChange={(event) => setKind(event.target.value)}
          className="h-12 border border-line bg-oil px-3 text-cream"
        >
          {kinds.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="stamp text-[11px] text-steel">Año del tracto</span>
        <input
          value={year}
          onChange={(event) => setYear(event.target.value)}
          inputMode="numeric"
          placeholder="2005"
          className="h-12 border border-line bg-oil px-3 text-cream placeholder:text-steel"
        />
      </label>
      <label className="grid gap-2">
        <span className="stamp text-[11px] text-steel">Qué se busca</span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          placeholder="Cabina para tractocamión, sin golpe estructural."
          className="border border-line bg-oil px-3 py-3 text-cream placeholder:text-steel"
        />
      </label>
      <button
        type="submit"
        className="stamp h-12 border border-amber bg-amber text-[12px] text-oil hover:bg-cream"
      >
        Pedir cotización
      </button>
    </form>
  );
}
