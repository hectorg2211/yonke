"use client";

import { QuoteChoiceArt, type QuoteArtId } from "@/components/quote-choice-art";
import { quoteChoiceClass } from "@/lib/quotes";

export type QuoteChoice<T extends string> = {
  value: T;
  label: string;
  hint?: string;
  art?: QuoteArtId;
};

export function QuoteChoices<T extends string>({
  name,
  value,
  options,
  onChange,
  columns = 2,
}: {
  name: string;
  value: T | "";
  options: readonly QuoteChoice<T>[];
  onChange: (value: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <div
      className={`grid gap-2 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}
    >
      {options.map((option) => {
        const on = value === option.value;
        return (
          <label
            key={option.value}
            className={`${quoteChoiceClass(on)} ${
              columns === 3 ? "flex-col items-start" : "min-h-16 items-center"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={on}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.art ? (
              <QuoteChoiceArt
                id={option.art}
                selected={on}
                compact={columns === 3}
              />
            ) : null}
            <span className="grid min-w-0 gap-1">
              <span className="stamp text-[11px]">{option.label}</span>
              {option.hint ? (
                <span
                  className={`text-xs font-normal tracking-normal normal-case ${
                    on ? "text-paper/80" : "text-steel"
                  }`}
                >
                  {option.hint}
                </span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}
