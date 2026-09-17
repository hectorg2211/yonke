"use client";

import { useState, type FormEvent } from "react";
import type { QuoteArtId } from "@/components/quote-choice-art";
import { QuoteChoices } from "@/components/quote-choices";
import { QuotePhotos } from "@/components/quote-photos";
import { QuoteWizard } from "@/components/quote-wizard";
import {
  articleTypes,
  axleKinds,
  conditions,
  needsAxleKind,
  quoteAreaClass,
  quoteFieldClass,
} from "@/lib/quotes";
import { sendQuoteToWhatsApp } from "@/lib/send-quote";

const steps = [
  {
    title: "Qué buscas",
    hint: "Toca el tipo de pieza y si la quieren nueva o usada.",
  },
  {
    title: "Identificar",
    hint: "Marca, modelo, año y serie. Si es eje, elige el subtipo.",
  },
  {
    title: "Foto",
    hint: "Toma la pieza en el patio. No es obligatorio.",
  },
  {
    title: "Enviar",
    hint: "El patio arma el precio y te contesta por WhatsApp.",
  },
] as const;

const articleArt: Record<(typeof articleTypes)[number], QuoteArtId> = {
  Cabina: "cabina",
  Motor: "motor",
  Transmisión: "transmision",
  Eje: "eje",
  Diferencial: "diferencial",
  Espejo: "espejo",
  Focos: "focos",
  Defensa: "defensa",
  Radiador: "radiador",
  "Pieza general": "pieza",
};

const articleOptions = articleTypes.map((value) => ({
  value,
  label: value,
  art: articleArt[value],
  hint:
    value === "Eje"
      ? "Delantero, trasero o loco"
      : value === "Pieza general"
        ? "Otra refacción"
        : undefined,
}));

const conditionOptions = [
  { value: "Usado" as const, label: "Usado", art: "usado" as const },
  { value: "Nuevo" as const, label: "Nuevo", art: "nuevo" as const },
];

const axleArt: Record<(typeof axleKinds)[number], QuoteArtId> = {
  Delantero: "eje-delantero",
  Trasero: "eje-trasero",
  "Trasero loco": "eje-tag",
  Loco: "eje-loco",
  "Solo (puro diferencial)": "eje-diff",
};

const axleOptions = axleKinds.map((value) => ({
  value,
  label: value,
  art: axleArt[value],
}));

export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<(typeof articleTypes)[number] | "">("");
  const [axle, setAxle] = useState<(typeof axleKinds)[number] | "">("");
  const [condition, setCondition] =
    useState<(typeof conditions)[number]>("Usado");
  const [year, setYear] = useState("");
  const [model, setModel] = useState("");
  const [series, setSeries] = useState("");
  const [brand, setBrand] = useState("");
  const [specs, setSpecs] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [pending, setPending] = useState(false);

  const axleNeeded = needsAxleKind(kind);

  function go(next: number) {
    setError(null);
    setStep(next);
  }

  function onNext() {
    if (step === 0 && !kind) {
      setError("Elige el tipo de pieza.");
      return;
    }
    if (step === 1 && axleNeeded && !axle) {
      setError("Elige el tipo de eje.");
      return;
    }
    go(Math.min(step + 1, steps.length - 1));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!kind) {
      setError("Elige el tipo de pieza.");
      go(0);
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setError("Nombre y WhatsApp son obligatorios.");
      return;
    }

    setPending(true);
    const lines = [
      "Hola, quiero cotizar una pieza.",
      `Nombre: ${name.trim()}`,
      `WhatsApp: ${phone.trim()}`,
      company.trim() ? `Empresa: ${company.trim()}` : null,
      `Tipo: ${kind}`,
      axleNeeded && axle ? `Subtipo: ${axle}` : null,
      brand.trim() ? `Marca: ${brand.trim()}` : null,
      model.trim() ? `Modelo: ${model.trim()}` : null,
      year.trim() ? `Año: ${year.trim()}` : null,
      series.trim() ? `Serie: ${series.trim()}` : null,
      `Condición: ${condition}`,
      specs.trim() ? `Especificaciones: ${specs.trim()}` : null,
      photos.length ? `Fotos: ${photos.length} adjunta(s)` : null,
    ];
    try {
      await sendQuoteToWhatsApp(lines, photos);
    } finally {
      setPending(false);
    }
  }

  return (
    <QuoteWizard
      label="Cotizador de piezas"
      steps={steps}
      step={step}
      error={error}
      pending={pending}
      onBack={() => go(step - 1)}
      onNext={onNext}
      onSubmit={onSubmit}
    >
      {step === 0 ? (
        <div className="grid gap-8">
          <fieldset className="grid gap-3">
            <legend className="stamp text-[11px] text-steel">
              Tipo de artículo
            </legend>
            <QuoteChoices
              name="article-type"
              value={kind}
              options={articleOptions}
              onChange={(value) => {
                setKind(value);
                setError(null);
                if (!needsAxleKind(value)) setAxle("");
              }}
            />
          </fieldset>
          <fieldset className="grid gap-3">
            <legend className="stamp text-[11px] text-steel">
              Nuevo o usado
            </legend>
            <QuoteChoices
              name="condition"
              value={condition}
              options={conditionOptions}
              onChange={setCondition}
              columns={2}
            />
          </fieldset>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="stamp text-[11px] text-steel">Marca</span>
              <input
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                placeholder="Freightliner, Kenworth…"
                autoComplete="off"
                className={quoteFieldClass}
              />
            </label>
            <label className="grid gap-2">
              <span className="stamp text-[11px] text-steel">Modelo</span>
              <input
                value={model}
                onChange={(event) => setModel(event.target.value)}
                autoComplete="off"
                className={quoteFieldClass}
              />
            </label>
            <label className="grid gap-2">
              <span className="stamp text-[11px] text-steel">Año</span>
              <input
                value={year}
                onChange={(event) => setYear(event.target.value)}
                inputMode="numeric"
                placeholder="2018"
                autoComplete="off"
                className={quoteFieldClass}
              />
            </label>
            <label className="grid gap-2">
              <span className="stamp text-[11px] text-steel">Serie</span>
              <input
                value={series}
                onChange={(event) => setSeries(event.target.value)}
                autoComplete="off"
                className={quoteFieldClass}
              />
            </label>
          </div>
          {axleNeeded ? (
            <fieldset className="grid gap-3">
              <legend className="stamp text-[11px] text-steel">
                Tipo de eje
              </legend>
              <QuoteChoices
                name="axle-kind"
                value={axle}
                options={axleOptions}
                onChange={(value) => {
                  setAxle(value);
                  setError(null);
                }}
              />
              <label className="grid gap-2">
                <span className="stamp text-[11px] text-steel">
                  Especificaciones
                </span>
                <textarea
                  value={specs}
                  onChange={(event) => setSpecs(event.target.value)}
                  rows={4}
                  placeholder="Medidas, lado, golpes, números de fundición."
                  className={quoteAreaClass}
                />
              </label>
            </fieldset>
          ) : null}
        </div>
      ) : null}

      {step === 2 ? (
        <QuotePhotos files={photos} onChange={setPhotos} variant="hero" />
      ) : null}

      {step === 3 ? (
        <div className="grid gap-6">
          <dl className="grid gap-2 border border-line bg-asphalt px-4 py-4 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-steel">Pieza</dt>
              <dd className="text-cream">
                {kind || "—"}
                {axleNeeded && axle ? ` · ${axle}` : ""}
                {` · ${condition}`}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-steel">Unidad</dt>
              <dd className="text-right text-cream">
                {[brand, model, year].filter(Boolean).join(" ") || "Sin datos"}
              </dd>
            </div>
            {series.trim() ? (
              <div className="flex justify-between gap-3">
                <dt className="text-steel">Serie</dt>
                <dd className="text-cream">{series.trim()}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3">
              <dt className="text-steel">Fotos</dt>
              <dd className="text-cream">
                {photos.length ? `${photos.length}` : "Ninguna"}
              </dd>
            </div>
          </dl>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="stamp text-[11px] text-steel">Nombre</span>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className={quoteFieldClass}
              />
            </label>
            <label className="grid gap-2">
              <span className="stamp text-[11px] text-steel">WhatsApp</span>
              <input
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="664 000 0000"
                className={quoteFieldClass}
              />
            </label>
          </div>
          <label className="grid gap-2">
            <span className="stamp text-[11px] text-steel">
              Empresa (opcional)
            </span>
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              autoComplete="organization"
              className={quoteFieldClass}
            />
          </label>
        </div>
      ) : null}
    </QuoteWizard>
  );
}
