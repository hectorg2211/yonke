"use client";

import { useState, type FormEvent } from "react";
import type { QuoteArtId } from "@/components/quote-choice-art";
import { QuoteChoices } from "@/components/quote-choices";
import { QuoteHoneypot } from "@/components/quote-honeypot";
import { QuotePhotos } from "@/components/quote-photos";
import { QuoteSent } from "@/components/quote-sent";
import { QuoteWizard } from "@/components/quote-wizard";
import {
  cargoTypes,
  importModes,
  quoteAreaClass,
  quoteFieldClass,
  transportTypes,
} from "@/lib/quotes";
import { sendQuote } from "@/lib/send-quote";

const steps = [
  {
    title: "Qué traes",
    hint: "Cabina, motor o camión.",
  },
  {
    title: "Cómo viene",
    hint: "Completo o cortado.",
  },
  {
    title: "Cómo llega",
    hint: "Transporte y, si los tienes, marca, modelo y año.",
  },
  {
    title: "Enviar",
    hint: "Nombre y WhatsApp para contestarte.",
  },
] as const;

const cargoHints: Partial<Record<(typeof cargoTypes)[number], string>> = {
  "Camión completo": "Entero",
  "Camión por partes": "Cortado",
  "Otra mercancía": "Otra cosa",
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
    label: "Cortado",
    art: "camion-cortado" as const,
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
  const [website, setWebsite] = useState("");
  const [started] = useState(() => String(Date.now()));
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  function go(next: number) {
    setError(null);
    setStep(next);
  }

  function onNext() {
    if (step === 0 && !cargo) {
      setError("Elige el tipo de mercancía.");
      return;
    }
    if (step === 1 && !mode) {
      setError("Elige si va completo o cortado.");
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
    if (!cargo || !mode || !transport) {
      setError("Faltan datos de la importación.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setError("Nombre y WhatsApp son obligatorios.");
      return;
    }

    setPending(true);
    try {
      const result = await sendQuote({
        channel: "importacion",
        fields: {
          cargo,
          mode,
          transport,
          brand,
          model,
          year,
          note,
          name,
          phone,
          email,
          company,
          website,
          started,
        },
        files: photos,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSent(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la cotización. Intenta de nuevo.",
      );
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <QuoteSent
        name={name}
        phone={phone}
        onAgain={() => {
          setSent(false);
          setStep(0);
          setCargo("");
          setMode("");
          setTransport("");
          setBrand("");
          setModel("");
          setYear("");
          setNote("");
          setPhotos([]);
          setError(null);
        }}
      />
    );
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
          <legend className="stamp text-[11px] text-steel">Qué es</legend>
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
              Completo o cortado
            </legend>
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
          <div className="stagger grid gap-6 sm:grid-cols-3">
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
              placeholder="Algo que nos ayude a cotizar…"
              className={quoteAreaClass}
            />
          </label>
          <QuotePhotos
            files={photos}
            onChange={setPhotos}
            hint="Opcional. Una foto ayuda a cotizar."
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
              <dd className="text-right text-cream">{mode || "—"}</dd>
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
          <div className="stagger grid gap-6 sm:grid-cols-2">
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
          <div className="stagger grid gap-6 sm:grid-cols-2">
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
          <QuoteHoneypot value={website} onChange={setWebsite} />
        </div>
      ) : null}
    </QuoteWizard>
  );
}
