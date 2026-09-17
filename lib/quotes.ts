export const quoteFieldClass =
  "h-12 w-full border border-line bg-panel px-3 text-cream placeholder:text-steel focus-visible:border-rust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

export const quoteAreaClass =
  "w-full border border-line bg-panel px-3 py-3 text-cream placeholder:text-steel focus-visible:border-rust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

export const quoteChoiceClass = (on: boolean) =>
  `flex cursor-pointer gap-3 border px-3 py-2.5 text-left transition-colors ${
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

export const presentationOptions = ["A presentar", "Sin presentar"] as const;

export const transportTypes = ["Plataforma", "Caja", "Otro"] as const;

export function needsAxleKind(article: string): boolean {
  return article === "Eje";
}
