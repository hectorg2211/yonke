"use client";

import { useEffect, useId, useRef, useState } from "react";

export type InventorySelectOption = {
  value: string;
  label: string;
};

export function InventorySelect({
  label,
  value,
  options,
  onChange,
  align = "right",
  fullWidth = false,
  labelPlacement = "inline",
}: {
  label: string;
  value: string;
  options: readonly InventorySelectOption[];
  onChange: (value: string) => void;
  align?: "left" | "right";
  fullWidth?: boolean;
  labelPlacement?: "inline" | "above";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const labelId = useId();
  const showInlineLabel = labelPlacement === "inline";

  return (
    <div
      ref={rootRef}
      className={`relative min-w-0 ${fullWidth ? "w-full" : "shrink-0"}`}
    >
      {labelPlacement === "above" ? (
        <p id={labelId} className="stamp mb-2 text-[10px] text-steel">
          {label}
        </p>
      ) : null}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${selected?.label ?? ""}`}
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex h-11 cursor-pointer items-center gap-2 border border-line bg-panel px-3 text-cream hover:border-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber ${
          fullWidth ? "w-full justify-between" : ""
        }`}
      >
        {showInlineLabel ? (
          <span className="stamp shrink-0 text-[10px] text-steel">{label}</span>
        ) : null}
        <span className="min-w-0 flex-1 truncate text-left text-sm">
          {selected?.label}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className={`size-3.5 shrink-0 text-amber transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 6.5 8 11.5 13 6.5" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className={`absolute z-20 mt-1 max-h-72 overflow-y-auto border border-line bg-panel py-1 ${
            fullWidth
              ? "inset-x-0"
              : `min-w-56 ${align === "right" ? "right-0" : "left-0"}`
          }`}
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value || option.label} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 px-3 text-left text-sm hover:bg-asphalt hover:text-amber focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber ${
                    active ? "text-amber" : "text-cream"
                  }`}
                >
                  {option.label}
                  {active ? (
                    <span aria-hidden className="size-1.5 rounded-full bg-amber" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
