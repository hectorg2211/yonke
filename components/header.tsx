"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-oil pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid size-11 place-items-center border border-amber bg-asphalt text-[11px] font-medium text-amber stamp">
            YC
          </span>
          <span className="leading-none">
            <span className="stamp block text-[10px] text-steel">Patio · Tijuana</span>
            <span className="display mt-1 block text-[26px] whitespace-nowrap text-cream group-hover:text-amber">
              {site.shortName}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`stamp text-[11px] transition-colors ${
                  active ? "text-amber" : "text-steel hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/importaciones"
            className="stamp border border-amber bg-amber px-4 py-2 text-[11px] text-oil transition-colors hover:bg-cream"
          >
            Cotizar
          </Link>
        </nav>

        <button
          type="button"
          className="stamp grid size-11 place-items-center border border-line text-[10px] text-cream md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
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
        </nav>
      ) : null}
    </header>
  );
}
