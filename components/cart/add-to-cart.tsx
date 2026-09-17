"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/components/cart/cart-provider";

export function AddToCart({
  variantId,
  availableForSale,
  quantityAvailable,
}: {
  variantId: string | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
}) {
  const { addItem } = useCart();
  const maxQuantity =
    quantityAvailable != null && quantityAvailable > 0
      ? Math.min(50, quantityAvailable)
      : 50;
  const [quantity, setQuantity] = useState(1);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (!variantId) {
    return (
      <p className="text-sm text-steel">
        Cotízala con el patio.
      </p>
    );
  }

  if (!availableForSale) {
    return (
      <div className="border border-amber bg-asphalt px-5 py-5">
        <p className="stamp text-[11px] text-amber">Sin existencia</p>
        <p className="display mt-2 text-4xl text-cream md:text-5xl">Agotada</p>
        <p className="mt-3 text-sm leading-6 text-steel">
          Esta pieza ya no está en el patio. Cotiza una igual.
        </p>
        <a
          href="/cotizar"
          className="stamp mt-5 inline-flex h-11 items-center border border-rust bg-rust px-5 text-[12px] text-paper hover:bg-paper hover:text-ink"
        >
          Cotizar una igual
        </a>
      </div>
    );
  }

  function submit() {
    if (!variantId) return;
    setMessage(null);
    startTransition(() => {
      void addItem(variantId, Math.min(quantity, maxQuantity)).then((ok) => {
        if (ok) setMessage("Agregada al carrito.");
      });
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center border border-line">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="stamp px-3 py-3 text-[12px] text-cream hover:text-rust"
            aria-label="Quitar una"
          >
            −
          </button>
          <span className="stamp min-w-10 py-3 text-center text-[12px] text-rust">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
            className="stamp px-3 py-3 text-[12px] text-cream hover:text-rust"
            aria-label="Agregar una"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="stamp border border-rust bg-rust px-6 py-3 text-[12px] text-paper hover:bg-paper hover:text-ink disabled:opacity-50"
        >
          {pending ? "Agregando…" : "Agregar al carrito"}
        </button>
      </div>
      {message ? <p className="text-sm text-rust">{message}</p> : null}
    </div>
  );
}
