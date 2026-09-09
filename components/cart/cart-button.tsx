"use client";

import { useCart } from "@/components/cart/cart-provider";

export function CartButton() {
  const { cart, openCart } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <button
      type="button"
      onClick={openCart}
      className="stamp relative border border-line px-3 py-2 text-[10px] text-cream hover:border-amber hover:text-amber"
      aria-label={
        count === 1
          ? "Abrir carrito, 1 pieza"
          : count
            ? `Abrir carrito, ${count} piezas`
            : "Abrir carrito"
      }
    >
      Carrito
      {count > 0 ? (
        <span className="absolute -top-1.5 -right-1.5 grid min-w-5 place-items-center bg-amber px-1 text-[9px] text-oil">
          {count}
        </span>
      ) : null}
    </button>
  );
}
