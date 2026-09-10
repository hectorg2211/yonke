import Link from "next/link";

export function WhatsappFab() {
  return (
    <Link
      href="/importaciones"
      className="fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] z-50 flex items-center gap-3 border border-amber bg-oxide px-4 py-3 text-paper shadow-[6px_6px_0_#06101c] transition-transform hover:-translate-y-0.5"
      aria-label="Abrir cotización o chat"
    >
      <span className="grid size-8 place-items-center bg-amber text-oil stamp text-[10px]">
        WA
      </span>
      <span className="hidden text-left sm:block">
        <span className="stamp block text-[10px] text-amber">Atención</span>
        <span className="text-sm font-medium">Preguntar por una pieza</span>
      </span>
    </Link>
  );
}
