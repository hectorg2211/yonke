import type { ReactNode } from "react";

export const quoteArtIds = [
  "cabina",
  "motor",
  "transmision",
  "eje",
  "diferencial",
  "espejo",
  "focos",
  "defensa",
  "radiador",
  "pieza",
  "usado",
  "nuevo",
  "eje-delantero",
  "eje-trasero",
  "eje-tag",
  "eje-loco",
  "eje-diff",
  "camion",
  "camion-cortado",
  "carga",
  "presentar",
  "sin-presentar",
  "plataforma",
  "caja",
  "otro",
] as const;

export type QuoteArtId = (typeof quoteArtIds)[number];

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className="pointer-events-none size-full"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="miter"
        strokeLinecap="square"
      >
        {children}
      </g>
    </svg>
  );
}

const art: Record<QuoteArtId, ReactNode> = {
  cabina: (
    <Frame>
      <path d="M12 32h20v4H12z" />
      <path d="M14 32V14h10l8 10v8" />
      <path d="M24 14v10h8" />
      <circle cx="18" cy="36" r="3.5" />
      <circle cx="30" cy="36" r="3.5" />
    </Frame>
  ),
  motor: (
    <Frame>
      <rect x="12" y="16" width="24" height="18" />
      <path d="M16 16V10h6v6M26 16V12h8v4" />
      <path d="M12 24H8v6h4M36 22h4v8h-4" />
      <path d="M18 22h12M18 28h12" />
    </Frame>
  ),
  transmision: (
    <Frame>
      <path d="M10 22h8v8H10z" />
      <path d="M18 20h16v12H18z" />
      <path d="M34 24h6v4h-6" />
      <circle cx="26" cy="26" r="3" />
    </Frame>
  ),
  eje: (
    <Frame>
      <path d="M10 24h28" />
      <circle cx="12" cy="24" r="7" />
      <circle cx="12" cy="24" r="3" />
      <circle cx="36" cy="24" r="7" />
      <circle cx="36" cy="24" r="3" />
    </Frame>
  ),
  diferencial: (
    <Frame>
      <path d="M8 24h32" />
      <circle cx="24" cy="24" r="8" />
      <path d="M24 16v16M18 24h12" />
    </Frame>
  ),
  espejo: (
    <Frame>
      <rect x="16" y="8" width="16" height="22" rx="1" />
      <path d="M24 30v8M18 38h12" />
      <path d="M20 12h8v12h-8z" />
    </Frame>
  ),
  focos: (
    <Frame>
      <circle cx="24" cy="24" r="12" />
      <circle cx="24" cy="24" r="6" />
      <path d="M24 12v4M24 32v4M12 24h4M32 24h4" />
    </Frame>
  ),
  defensa: (
    <Frame>
      <path d="M8 20h32v8H8z" />
      <path d="M12 20v-4h6v4M30 20v-4h6v4" />
      <path d="M16 28v4M32 28v4" />
    </Frame>
  ),
  radiador: (
    <Frame>
      <rect x="12" y="10" width="24" height="28" />
      <path d="M16 16h16M16 22h16M16 28h16M16 34h16" />
      <circle cx="24" cy="24" r="4" />
    </Frame>
  ),
  pieza: (
    <Frame>
      <circle cx="24" cy="24" r="10" />
      <circle cx="24" cy="24" r="4" />
      <path d="M24 10v4M24 34v4M10 24h4M34 24h4" />
    </Frame>
  ),
  usado: (
    <Frame>
      <path d="M10 32h28v4H10z" />
      <path d="M12 32V20h10l6 7h10v5" />
      <path d="M16 18l8 10" />
      <circle cx="18" cy="36" r="3" />
      <circle cx="34" cy="36" r="3" />
    </Frame>
  ),
  nuevo: (
    <Frame>
      <rect x="12" y="12" width="24" height="24" />
      <path d="M12 18h24M20 12v6" />
      <path d="M18 28h12" />
    </Frame>
  ),
  "eje-delantero": (
    <Frame>
      <path d="M8 24h32" />
      <circle cx="12" cy="24" r="6" />
      <circle cx="36" cy="24" r="6" />
      <path d="M16 18h16M18 18l-4-6M30 18l4-6" />
    </Frame>
  ),
  "eje-trasero": (
    <Frame>
      <path d="M8 24h32" />
      <circle cx="12" cy="24" r="6" />
      <circle cx="36" cy="24" r="6" />
      <circle cx="24" cy="24" r="6" />
    </Frame>
  ),
  "eje-tag": (
    <Frame>
      <path d="M8 20h32M8 30h32" />
      <circle cx="12" cy="20" r="5" />
      <circle cx="36" cy="20" r="5" />
      <circle cx="12" cy="30" r="4" />
      <circle cx="36" cy="30" r="4" />
    </Frame>
  ),
  "eje-loco": (
    <Frame>
      <path d="M8 24h32" />
      <circle cx="12" cy="24" r="6" />
      <circle cx="36" cy="24" r="6" />
      <path d="M20 24h8" />
    </Frame>
  ),
  "eje-diff": (
    <Frame>
      <circle cx="24" cy="24" r="10" />
      <path d="M24 14v20M16 24h16" />
      <path d="M10 24h6M32 24h6" />
    </Frame>
  ),
  camion: (
    <Frame>
      <path d="M4 30h40v3H4z" />
      <path d="M6 30V16h10l6 8h22v6" />
      <path d="M16 16v8h6" />
      <path d="M28 14h14v16" />
      <circle cx="12" cy="34" r="3.5" />
      <circle cx="36" cy="34" r="3.5" />
    </Frame>
  ),
  "camion-cortado": (
    <Frame>
      <path d="M6 30h14v4H6z" />
      <path d="M8 30V16h12v14" />
      <path d="M28 18h12v16H28z" />
      <path d="M24 12v24" strokeDasharray="3 3" />
      <circle cx="14" cy="34" r="3" />
      <circle cx="36" cy="34" r="3" />
    </Frame>
  ),
  carga: (
    <Frame>
      <path d="M10 18h28v18H10z" />
      <path d="M10 24h28M24 18v18" />
      <path d="M16 18V12h16v6" />
    </Frame>
  ),
  presentar: (
    <Frame>
      <path d="M14 34h20v4H14z" />
      <path d="M16 34V16h8l8 6v12" />
      <path d="M24 16v10h8" />
    </Frame>
  ),
  "sin-presentar": (
    <Frame>
      <rect x="8" y="28" width="12" height="10" />
      <rect x="28" y="14" width="12" height="10" />
      <circle cx="34" cy="34" r="5" />
    </Frame>
  ),
  plataforma: (
    <Frame>
      <path d="M8 26h32v4H8z" />
      <path d="M8 26V18h10v8" />
      <circle cx="16" cy="32" r="3.5" />
      <circle cx="34" cy="32" r="3.5" />
    </Frame>
  ),
  caja: (
    <Frame>
      <path d="M8 16h32v16H8z" />
      <path d="M18 16v16" />
      <circle cx="16" cy="34" r="3.5" />
      <circle cx="34" cy="34" r="3.5" />
    </Frame>
  ),
  otro: (
    <Frame>
      <circle cx="24" cy="24" r="10" />
      <path d="M24 18v8M24 30v2" />
    </Frame>
  ),
};

export function QuoteChoiceArt({
  id,
  selected,
  compact = false,
}: {
  id: QuoteArtId;
  selected: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center border ${
        compact ? "size-10" : "size-12"
      } ${selected ? "border-paper/35 bg-ink/20" : "border-line bg-asphalt"}`}
    >
      {art[id]}
    </span>
  );
}
