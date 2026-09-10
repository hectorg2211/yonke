"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CartButton } from "@/components/cart/cart-button";
import { nav } from "@/lib/site";

export type HeaderAccount = {
  enabled: boolean;
  signedIn: boolean;
};

export function Header({ account }: { account: HeaderAccount }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-100 border-b border-line bg-oil">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-full h-24 bg-oil"
      />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <div className="flex min-w-0 items-center gap-6 lg:gap-8">
          <Link
            href="/"
            aria-label="Yonke El Cuñado Tractopartes y Servicios"
            className="shrink-0"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/assets/logo.png"
              alt="Yonke El Cuñado Tractopartes y Servicios"
              width={1363}
              height={294}
              priority
              className="h-9 w-auto max-w-44 object-contain object-left md:h-11 md:max-w-60"
            />
          </Link>
          <nav className="hidden items-center gap-6 md:flex lg:gap-8">
            {nav
              .filter((item) => item.href !== "/importaciones")
              .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`stamp text-[11px] transition-colors ${
                  isActive(item.href)
                    ? "text-amber"
                    : "text-steel hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-4 md:flex lg:gap-6">
          <Link
            href="/importaciones"
            className="stamp border border-amber bg-amber px-4 py-2 text-[11px] text-oil transition-colors hover:bg-cream"
          >
            Cotizar
          </Link>
          {account.enabled ? (
            account.signedIn ? (
              <Link
                href="/cuenta"
                className={`stamp text-[11px] transition-colors ${
                  isActive("/cuenta")
                    ? "text-amber"
                    : "text-steel hover:text-cream"
                }`}
              >
                Cuenta
              </Link>
            ) : (
              <a
                href="/api/auth/shopify/login?returnTo=/cuenta"
                className="stamp text-[11px] text-steel hover:text-cream"
              >
                Entrar
              </a>
            )
          ) : null}
          <CartButton />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {account.enabled && account.signedIn ? (
            <Link
              href="/cuenta"
              className="stamp border border-line px-3 py-2 text-[10px] text-cream hover:border-amber hover:text-amber"
            >
              Cuenta
            </Link>
          ) : null}
          <CartButton />
          <button
            type="button"
            className="stamp grid size-11 place-items-center border border-line text-[10px] text-cream"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="grid gap-1 border-t border-line bg-asphalt px-5 py-4 md:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`display py-3 text-4xl ${
                isActive(item.href) ? "text-amber" : "text-cream"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {account.enabled ? (
            account.signedIn ? (
              <Link
                href="/cuenta"
                onClick={() => setOpen(false)}
                className={`display py-3 text-4xl ${
                  isActive("/cuenta") ? "text-amber" : "text-cream"
                }`}
              >
                Cuenta
              </Link>
            ) : (
              <a
                href="/api/auth/shopify/login?returnTo=/cuenta"
                className="display py-3 text-5xl text-cream"
              >
                Entrar
              </a>
            )
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
