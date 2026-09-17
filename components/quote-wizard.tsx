"use client";

import {
  useEffect,
  useRef,
  type FormEvent,
  type ReactNode,
} from "react";

export type QuoteWizardStep = {
  title: string;
  hint: string;
};

function blurActive() {
  const active = document.activeElement;
  if (active instanceof HTMLElement) active.blur();
}

export function QuoteWizard({
  label,
  steps,
  step,
  error,
  pending,
  children,
  onBack,
  onNext,
  onSubmit,
}: {
  label: string;
  steps: readonly QuoteWizardStep[];
  step: number;
  error: string | null;
  pending: boolean;
  children: ReactNode;
  onBack: () => void;
  onNext: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevStep = useRef(step);
  const last = step >= steps.length - 1;
  const current = steps[step];

  useEffect(() => {
    if (prevStep.current === step) return;
    prevStep.current = step;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ behavior: "auto", block: "nearest" });
  }, [step]);

  if (!current) return null;

  return (
    <form
      className="grid gap-6"
      aria-label={label}
      onSubmit={(event) => {
        event.preventDefault();
        if (last) {
          onSubmit(event);
          return;
        }
        blurActive();
        onNext();
      }}
    >
      <div className="grid gap-3">
        <div
          className="grid grid-cols-4 gap-1"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          aria-label={`Paso ${step + 1} de ${steps.length}`}
        >
          {steps.map((item, index) => (
            <div
              key={item.title}
              className={`h-1 ${index <= step ? "bg-rust" : "bg-line"}`}
            />
          ))}
        </div>
        <p className="stamp text-[11px] text-rust">
          {String(step + 1).padStart(2, "0")} /{" "}
          {String(steps.length).padStart(2, "0")}
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="display scroll-mt-24 text-3xl text-cream outline-none md:text-4xl"
        >
          {current.title}
        </h2>
        <p className="text-sm leading-6 text-steel">{current.hint}</p>
      </div>

      {children}

      {error ? (
        <p className="text-sm text-rust" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 border-t border-line pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => {
              blurActive();
              onBack();
            }}
            className="stamp h-12 border border-line px-5 text-[12px] text-cream hover:border-rust hover:text-rust"
          >
            Atrás
          </button>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="stamp ml-auto h-12 border border-rust bg-rust px-5 text-[12px] text-paper hover:bg-paper hover:text-ink disabled:opacity-50"
        >
          {pending
            ? "Abriendo WhatsApp…"
            : last
              ? "Pedir cotización"
              : "Continuar"}
        </button>
      </div>
    </form>
  );
}
