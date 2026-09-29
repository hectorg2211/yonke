export const quoteFieldClass =
  "h-12 w-full border border-line bg-panel px-3 text-cream placeholder:text-steel focus-visible:border-rust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

export const quoteAreaClass =
  "w-full border border-line bg-panel px-3 py-3 text-cream placeholder:text-steel focus-visible:border-rust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

export const quoteChoiceClass = (on: boolean) =>
  `flex min-w-0 cursor-pointer gap-2 overflow-hidden border px-2.5 py-2.5 text-left transition-colors sm:gap-3 sm:px-3 ${
    on
      ? "border-rust bg-rust text-paper"
      : "border-line bg-panel text-cream hover:border-rust hover:text-rust"
  }`;

export const articleTypes = [
  "Cabina",
  "Motor",
  "Transmisión",
  "Eje",
  "Diferencial",
  "Espejo",
  "Focos",
  "Defensa",
  "Radiador",
  "Pieza general",
] as const;

export const axleKinds = [
  "Delantero",
  "Trasero",
  "Trasero loco",
  "Loco",
  "Solo (puro diferencial)",
] as const;

export const conditions = ["Usado", "Nuevo"] as const;

export const cargoTypes = [
  "Cabina",
  "Motor",
  "Camión completo",
  "Camión por partes",
  "Otra mercancía",
] as const;

export const importModes = ["Completo", "Por partes (cortado)"] as const;

export const transportTypes = ["Plataforma", "Caja", "Otro"] as const;

export function needsAxleKind(article: string): boolean {
  return article === "Eje";
}

export const quotePhotoLimits = {
  maxFiles: 3,
  maxBytes: 8 * 1024 * 1024,
} as const;

export function isAllowed<T extends readonly string[]>(
  value: string,
  allowed: T,
): value is T[number] {
  return (allowed as readonly string[]).includes(value);
}
