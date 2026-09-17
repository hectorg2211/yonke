import Link from "next/link";

export function QuoteSwitcher({
  active,
}: {
  active: "pieza" | "importacion";
}) {
  const itemClass = (on: boolean) =>
    `stamp inline-flex h-11 items-center px-4 text-[11px] ${
      on
        ? "border border-rust bg-rust text-paper"
        : "border border-line bg-paper text-cream hover:border-rust hover:text-rust"
    }`;

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/cotizar" className={itemClass(active === "pieza")}>
        Cotizar pieza
      </Link>
      <Link
        href="/importaciones"
        className={itemClass(active === "importacion")}
      >
        Cotizar importación
      </Link>
    </div>
  );
}