"use client";

import { useState, type FormEvent } from "react";
import type { QuoteArtId } from "@/components/quote-choice-art";
import { QuoteChoices } from "@/components/quote-choices";
import { QuotePhotos } from "@/components/quote-photos";
import { QuoteWizard } from "@/components/quote-wizard";
import {
  cargoTypes,
  importModes,
  presentationOptions,
  quoteAreaClass,
  quoteFieldClass,
  transportTypes,
} from "@/lib/quotes";
import { sendQuoteToWhatsApp } from "@/lib/send-quote";

const steps = [
  {
    title: "Mercancía",
    hint: "Qué van a importar. El trámite cambia si es cabina, motor o camión.",
  },
  {
    title: "Cómo viene",
    hint: "Completo o cortado, y si hay que presentarla armada.",
  },
  {
    title: "Transporte",
    hint: "Cómo se mueve y, si ya los tienes, marca, modelo y año.",
  },
  {
    title: "Enviar",
    hint: "El patio confirma el monto. La aduana puede mover el precio.",
  },
] as const;

const cargoHints: Record<(typeof cargoTypes)[number], string> = {
  Cabina: "Caseta suelta",
  Motor: "Motor a traer",
  "Camión completo": "Unidad armada",
  "Camión por partes": "Cortado",
  "Otra mercancía": "Otra carga",
};

const cargoArt: Record<(typeof cargoTypes)[number], QuoteArtId> = {
  Cabina: "cabina",
  Motor: "motor",
  "Camión completo": "camion",
  "Camión por partes": "camion-cortado",
  "Otra mercancía": "carga",
};

const cargoOptions = cargoTypes.map((value) => ({
  value,
  label: value,
  hint: cargoHints[value],
  art: cargoArt[value],
}));
const modeOptions = [
  { value: "Completo" as const, label: "Completo", art: "camion" as const },
  {
    value: "Por partes (cortado)" as const,
    label: "Por partes (cortado)",
    art: "camion-cortado" as const,
  },
];
const presentationChoiceOptions = [
  {
    value: "A presentar" as const,
    label: "A presentar",
    art: "presentar" as const,
  },
  {
    value: "Sin presentar" as const,
    label: "Sin presentar",
    art: "sin-presentar" as const,
  },
];
const transportOptions = [
  {
    value: "Plataforma" as const,
    label: "Plataforma",
    art: "plataforma" as const,
  },
  { value: "Caja" as const, label: "Caja", art: "caja" as const },
  { value: "Otro" as const, label: "Otro", art: "otro" as const },
];

export function ImportQuoteForm() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [cargo, setCargo] = useState<(typeof cargoTypes)[number] | "">("");
  const [mode, setMode] = useState<(typeof importModes)[number] | "">("");
  const [presentation, setPresentation] =
    useState<(typeof presentationOptions)[number] | "">("");
  const [transport, setTransport] =
    useState<(typeof transportTypes)[number] | "">("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [pending, setPending] = useState(false);

  function go(next: number) {
    setError(null);
    setStep(next);
  }

  function onNext() {
    if (step === 0 && !cargo) {
      setError("Elige el tipo de mercancía.");
      return;
    }
    if (step === 1 && (!mode || !presentation)) {
      setError("Elige si va completo o cortado, y si se presenta.");
      return;
    }
    if (step === 2 && !transport) {
      setError("Elige el tipo de transporte.");
      return;
    }
    go(Math.min(step + 1, steps.length - 1));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cargo || !mode || !presentation || !transport) {
      setError("Faltan datos de la importación.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setError("Nombre y WhatsApp son obligatorios.");
      return;
    }

    setPending(true);
    const lines = [
      "Hola, quiero cotizar una importación.",
      `Nombre: ${name.trim()}`,
      `WhatsApp: ${phone.trim()}`,
      email.trim() ? `Correo: ${email.trim()}` : null,
      company.trim() ? `Empresa: ${company.trim()}` : null,
      `Mercancía: ${cargo}`,
      `Importación: ${mode}`,
      `Presentación: ${presentation}`,
      `Transporte: ${transport}`,
      brand.trim() ? `Marca: ${brand.trim()}` : null,
      model.trim() ? `Modelo: ${model.trim()}` : null,
      year.trim() ? `Año: ${year.trim()}` : null,
      note.trim() ? `Detalle: ${note.trim()}` : null,
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
      label="Cotizador de importación"
      steps={steps}
      step={step}
      error={error}
      pending={pending}
      onBack={() => go(step - 1)}
      onNext={onNext}
      onSubmit={onSubmit}
    >
      {step === 0 ? (
        <fieldset className="grid gap-3">
          <legend className="stamp text-[11px] text-steel">
            Tipo de mercancía
          </legend>
          <QuoteChoices
            name="cargo-type"
            value={cargo}
            options={cargoOptions}
            onChange={(value) => {
              setCargo(value);
              setError(null);
            }}
          />
        </fieldset>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-8">
          <fieldset className="grid gap-3">
            <legend className="stamp text-[11px] text-steel">
              Completo o por partes
            </legend>
            <p className="text-sm text-steel">
              El trámite y el monto cambian si es cabina, camión cortado o
              unidad completa.
            </p>
            <QuoteChoices
              name="import-mode"
              value={mode}
              options={modeOptions}
              onChange={(value) => {
                setMode(value);
                setError(null);
              }}
            />
          </fieldset>
          <fieldset className="grid gap-3">
            <legend className="stamp text-[11px] text-steel">
              Presentación
            </legend>
            <QuoteChoices
              name="presentation"
              value={presentation}
              options={presentationChoiceOptions}
              onChange={(value) => {
                setPresentation(value);
                setError(null);
              }}
            />
          </fieldset>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-8">
          <fieldset className="grid gap-3">
            <legend className="stamp text-[11px] text-steel">Transporte</legend>
            <QuoteChoices
              name="transport"
              value={transport}
              options={transportOptions}
              onChange={(value) => {
                setTransport(value);
                setError(null);
              }}
              columns={3}
            />
          </fieldset>
          <div className="grid gap-6 sm:grid-cols-3">
            <label className="grid gap-2">
              <span className="stamp text-[11px] text-steel">Marca</span>
              <input
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
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
          </div>
          <label className="grid gap-2">
            <span className="stamp text-[11px] text-steel">
              Detalle (opcional)
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Cabina cortada, motor suelto, si va completo o por partes…"
              className={quoteAreaClass}
            />
          </label>
          <QuotePhotos
            files={photos}
            onChange={setPhotos}
            hint="Opcional. Una foto evita cruzar cabina con camión completo."
          />
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-6">
          <dl className="grid gap-2 border border-line bg-asphalt px-4 py-4 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-steel">Carga</dt>
              <dd className="text-right text-cream">{cargo || "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-steel">Modo</dt>
              <dd className="text-right text-cream">
                {[mode, presentation].filter(Boolean).join(" · ") || "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-steel">Transporte</dt>
              <dd className="text-cream">{transport || "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-steel">Unidad</dt>
              <dd className="text-right text-cream">
                {[brand, model, year].filter(Boolean).join(" ") || "Sin datos"}
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
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="stamp text-[11px] text-steel">
                Correo (opcional)
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className={quoteFieldClass}
              />
            </label>
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
        </div>
      ) : null}
    </QuoteWizard>
  );
}
