"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { InventorySelect } from "@/components/inventory-select";
import {
  SORT_OPTIONS,
  hasActiveFilters,
  inventoryHref,
  type InventoryQuery,
  type InventorySort,
} from "@/lib/inventory";

const chipClass =
  "stamp inline-flex h-11 shrink-0 cursor-pointer items-center border px-3 text-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";

function chipTone(active: boolean) {
  return active
    ? "border-amber bg-amber text-oil"
    : "border-line bg-asphalt text-steel hover:border-amber hover:text-amber";
}

export function InventoryToolbar({
  query,
  families,
}: {
  query: InventoryQuery;
  families: readonly string[];
}) {
  const router = useRouter();
  const queryRef = useRef(query);
  const [draft, setDraft] = useState(query.q);
  const [, startTransition] = useTransition();

  queryRef.current = query;

  useEffect(() => {
    setDraft(query.q);
  }, [query.q]);

  useEffect(() => {
    if (draft === query.q) return;
    const timeout = window.setTimeout(() => {
      startTransition(() => {
        router.replace(
          inventoryHref(queryRef.current, { q: draft.trim(), pagina: 1 }),
        );
      });
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [draft, query.q, router]);

  function navigate(overrides: Partial<InventoryQuery>) {
    startTransition(() => {
      router.replace(inventoryHref(queryRef.current, { pagina: 1, ...overrides }));
    });
  }

  return (
    <form
      action="/inventario"
      method="get"
      className="mt-4 grid gap-3"
      role="search"
      aria-label="Buscar en el inventario"
      onSubmit={(event) => {
        event.preventDefault();
        navigate({ q: draft.trim() });
      }}
    >
      <label className="relative block">
        <span className="sr-only">Buscar pieza</span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-steel"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16.5 20 20.5" strokeLinecap="square" />
        </svg>
        <input
          type="search"
          name="q"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Buscar por SKU, cabina, motor…"
          autoComplete="off"
          enterKeyHint="search"
          className="h-11 w-full border border-line bg-panel pr-11 pl-11 text-base text-cream placeholder:text-steel focus-visible:border-amber focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
        />
        {draft ? (
          <button
            type="button"
            onClick={() => {
              setDraft("");
              navigate({ q: "" });
            }}
            className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 cursor-pointer place-items-center text-steel hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
            aria-label="Borrar búsqueda"
          >
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" />
            </svg>
          </button>
        ) : null}
      </label>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-none">
          {families.map((family) => {
            const value = family === "Todos" ? "" : family;
            const active = query.familia === value;
            return (
              <Link
                key={family}
                href={inventoryHref(query, { familia: value, pagina: 1 })}
                className={`${chipClass} ${chipTone(active)}`}
                aria-current={active ? "page" : undefined}
              >
                {family}
              </Link>
            );
          })}
          <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-line" />
          <Link
            href={inventoryHref(query, {
              stock: query.stock === "disponible" ? "todos" : "disponible",
              pagina: 1,
            })}
            className={`${chipClass} ${chipTone(query.stock === "disponible")}`}
          >
            En venta
          </Link>
          {hasActiveFilters(query) ? (
            <Link
              href="/inventario"
              className={`${chipClass} border-line bg-transparent text-steel hover:border-amber hover:text-amber`}
            >
              Limpiar
            </Link>
          ) : null}
        </div>

        <InventorySelect
          label="Ordenar"
          value={query.orden}
          options={SORT_OPTIONS}
          onChange={(value) => navigate({ orden: value as InventorySort })}
        />
      </div>
    </form>
  );
}
