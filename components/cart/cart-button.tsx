"use client";

import { useCart } from "@/components/cart/cart-provider";

export function CartButton() {
  const { cart, openCart } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative grid size-11 place-items-center border border-line text-cream hover:border-amber hover:text-amber"
      aria-label={
        count === 1
          ? "Abrir carrito, 1 pieza"
          : count
            ? `Abrir carrito, ${count} piezas`
            : "Abrir carrito"
      }
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="M3.5 5.5h1.8l1.4 9.2h11.5L20.5 8H7.2" strokeLinecap="square" />
        <circle cx="9.2" cy="18.4" r="1.35" fill="currentColor" stroke="none" />
        <circle cx="16.6" cy="18.4" r="1.35" fill="currentColor" stroke="none" />
      </svg>
      {count > 0 ? (
        <span className="absolute -top-1.5 -right-1.5 grid min-w-5 place-items-center bg-amber px-1 text-[9px] font-medium text-oil">
          {count}
        </span>
      ) : null}
    </button>
  );
}
