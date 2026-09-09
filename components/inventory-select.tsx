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
}: {
  label: string;
  value: string;
  options: readonly InventorySelectOption[];
  onChange: (value: string) => void;
  align?: "left" | "right";
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

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-11 cursor-pointer items-center gap-2 border border-line bg-asphalt px-3 text-cream hover:border-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
      >
        <span className="stamp text-[10px] text-steel">{label}</span>
        <span className="max-w-36 truncate text-sm">{selected?.label}</span>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className={`size-3.5 text-amber transition-transform ${open ? "rotate-180" : ""}`}
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
          className={`absolute z-20 mt-1 min-w-56 border border-line bg-panel py-1 shadow-[0_16px_40px_rgb(0_0_0/0.45)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left text-sm hover:bg-asphalt hover:text-amber focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber ${
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
