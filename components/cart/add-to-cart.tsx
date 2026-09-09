"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/components/cart/cart-provider";

export function AddToCart({
  variantId,
  availableForSale,
}: {
  variantId: string | null;
  availableForSale: boolean;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (!variantId) {
    return (
      <p className="text-sm text-steel">
        Esta pieza todavía no está en Shopify. Cotízala con el patio.
      </p>
    );
  }

  if (!availableForSale) {
    return (
      <p className="stamp border border-line px-6 py-3 text-[12px] text-steel">
        Agotada
      </p>
    );
  }

  function submit() {
    if (!variantId) return;
    setMessage(null);
    startTransition(() => {
      void addItem(variantId, quantity).then((ok) => {
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
            className="stamp px-3 py-3 text-[12px] text-cream hover:text-amber"
            aria-label="Quitar una"
          >
            −
          </button>
          <span className="stamp min-w-10 py-3 text-center text-[12px] text-amber">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(50, value + 1))}
            className="stamp px-3 py-3 text-[12px] text-cream hover:text-amber"
            aria-label="Agregar una"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="stamp border border-amber bg-amber px-6 py-3 text-[12px] text-oil hover:bg-cream disabled:opacity-50"
        >
          {pending ? "Agregando…" : "Agregar al carrito"}
        </button>
      </div>
      {message ? <p className="text-sm text-amber">{message}</p> : null}
    </div>
  );
}
