"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { productPath } from "@/lib/site";

export function CartDrawer() {
  const {
    cart,
    open,
    pending,
    error,
    closeCart,
    setLineQuantity,
    removeLine,
  } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const lines = cart?.lines ?? [];
  const empty = lines.length === 0;

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeCart();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeCart]);

  return (
    <>
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className={`fixed inset-0 z-110 bg-oil/70 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-120 flex w-full max-w-md flex-col border-l border-line bg-oil shadow-[-12px_0_0_#0c0b09] transition-transform duration-300 ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="hazard h-2 shrink-0" />
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="stamp text-[10px] text-steel">YC-CART</p>
            <h2 id="cart-title" className="display mt-1 text-4xl text-cream">
              Carrito
            </h2>
            <p className="mt-1 text-sm text-steel">
              {cart?.totalQuantity
                ? `${cart.totalQuantity} pieza${cart.totalQuantity === 1 ? "" : "s"}`
                : "Vacío"}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="stamp border border-line px-3 py-2 text-[10px] text-cream hover:border-amber hover:text-amber"
          >
            Cerrar
          </button>
        </div>

        {error ? (
          <p className="border-b border-rust/40 bg-oxide/20 px-5 py-3 text-sm text-amber">
            {error}
          </p>
        ) : null}

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {empty ? (
            <div className="border border-line bg-asphalt px-5 py-8">
              <p className="stamp text-[10px] text-amber">Patio</p>
              <p className="mt-3 text-cream">El carrito está vacío.</p>
              <p className="mt-2 text-sm text-steel">
                Agrega una pieza desde el inventario.
              </p>
              <Link
                href="/inventario"
                onClick={closeCart}
                className="stamp mt-6 inline-block border border-line px-4 py-2 text-[11px] text-cream hover:border-amber hover:text-amber"
              >
                Ver inventario
              </Link>
            </div>
          ) : (
            <ul className="grid gap-4">
              {lines.map((line) => (
                <li key={line.id} className="grid grid-cols-[5rem_1fr] gap-3 border border-line bg-asphalt p-3">
                  <Link
                    href={productPath(line.handle)}
                    onClick={closeCart}
                    className="relative aspect-square overflow-hidden bg-panel"
                  >
                    {line.image ? (
                      <Image
                        src={line.image}
                        alt={line.imageAlt}
                        fill
                        sizes="80px"
                        className="object-cover grayscale"
                      />
                    ) : null}
                  </Link>
                  <div className="min-w-0">
                    <Link
                      href={productPath(line.handle)}
                      onClick={closeCart}
                      className="display block truncate text-2xl text-cream hover:text-amber"
                    >
                      {line.title}
                    </Link>
                    {line.variantTitle ? (
                      <p className="mt-1 text-xs text-steel">{line.variantTitle}</p>
                    ) : null}
                    <p className="mt-2 text-sm text-amber">{line.price}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => void setLineQuantity(line.id, line.quantity - 1)}
                          className="stamp px-2 py-1 text-[11px] text-cream hover:text-amber disabled:opacity-40"
                          aria-label="Quitar una"
                        >
                          −
                        </button>
                        <span className="stamp min-w-8 px-1 text-center text-[11px] text-amber">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => void setLineQuantity(line.id, line.quantity + 1)}
                          className="stamp px-2 py-1 text-[11px] text-cream hover:text-amber disabled:opacity-40"
                          aria-label="Agregar una"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => void removeLine(line.id)}
                        className="stamp text-[10px] text-steel underline decoration-rust underline-offset-4 hover:text-amber disabled:opacity-40"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-line bg-asphalt px-5 py-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="stamp text-[10px] text-steel">Total</p>
              <p className="mt-1 text-2xl text-amber">{cart?.total ?? "$0"}</p>
            </div>
            {cart?.subtotal && cart.subtotal !== cart.total ? (
              <p className="text-sm text-steel">Subtotal {cart.subtotal}</p>
            ) : null}
          </div>
          {empty || !cart?.checkoutUrl ? (
            <p className="stamp mt-4 border border-line px-4 py-3 text-center text-[11px] text-steel">
              Agrega una pieza para pagar
            </p>
          ) : (
            <a
              href={cart.checkoutUrl}
              className="stamp mt-4 flex items-center justify-center border border-amber bg-amber px-4 py-3 text-[12px] text-oil hover:bg-cream"
            >
              Ir a pagar
            </a>
          )}
          <p className="mt-3 text-xs leading-5 text-steel">
            El pago se cierra en Shopify Checkout.
          </p>
        </div>
      </aside>
    </>
  );
}
