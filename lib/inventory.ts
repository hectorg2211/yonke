import { categories, type CatalogItem } from "@/lib/site";

export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: "relevancia", label: "Relevancia" },
  { value: "nuevos", label: "Más recientes" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "az", label: "Nombre: A–Z" },
  { value: "za", label: "Nombre: Z–A" },
] as const;

export type InventorySort = (typeof SORT_OPTIONS)[number]["value"];
export type StockFilter = "todos" | "disponible";

export type InventoryQuery = {
  q: string;
  familia: string;
  stock: StockFilter;
  orden: InventorySort;
  pagina: number;
};

export type InventoryPage = {
  items: CatalogItem[];
  total: number;
  pagina: number;
  totalPages: number;
  from: number;
  to: number;
  truncated: boolean;
};

const SORT_VALUES = new Set<string>(SORT_OPTIONS.map((option) => option.value));

function firstParam(
  value: string | string[] | undefined,
): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function parseInventoryQuery(
  searchParams: Record<string, string | string[] | undefined>,
): InventoryQuery {
  const q = firstParam(searchParams.q).trim();
  const familiaRaw = firstParam(searchParams.familia).trim();
  const familia = familiaRaw === "Todos" ? "" : familiaRaw;
  const stockRaw = firstParam(searchParams.stock).trim().toLowerCase();
  const ordenRaw = firstParam(searchParams.orden).trim().toLowerCase();
  const paginaRaw = Number.parseInt(firstParam(searchParams.pagina), 10);

  return {
    q,
    familia,
    stock: stockRaw === "disponible" ? "disponible" : "todos",
    orden: SORT_VALUES.has(ordenRaw) ? (ordenRaw as InventorySort) : "relevancia",
    pagina: Number.isFinite(paginaRaw) && paginaRaw > 0 ? paginaRaw : 1,
  };
}

export function inventoryHref(
  query: InventoryQuery,
  overrides: Partial<InventoryQuery> = {},
): string {
  const next: InventoryQuery = { ...query, ...overrides };
  const params = new URLSearchParams();

  if (next.q) params.set("q", next.q);
  if (next.familia) params.set("familia", next.familia);
  if (next.stock === "disponible") params.set("stock", "disponible");
  if (next.orden !== "relevancia") params.set("orden", next.orden);
  if (next.pagina > 1) params.set("pagina", String(next.pagina));

  const serialized = params.toString();
  return serialized ? `/inventario?${serialized}` : "/inventario";
}

export function inventoryKey(query: InventoryQuery): string {
  return [
    query.q,
    query.familia,
    query.stock,
    query.orden,
    String(query.pagina),
  ].join("|");
}

export function hasActiveFilters(query: InventoryQuery): boolean {
  return Boolean(query.q || query.familia || query.stock === "disponible");
}

export function catalogFamilies(items: CatalogItem[]): string[] {
  const known = categories.filter((family) => family !== "Todos");
  const seen = new Set<string>(known);
  const extras: string[] = [];

  for (const item of items) {
    const family = item.category.trim();
    if (!family || seen.has(family)) continue;
    seen.add(family);
    extras.push(family);
  }

  return ["Todos", ...known, ...extras];
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matchesQuery(item: CatalogItem, query: InventoryQuery): boolean {
  if (query.familia && normalize(item.category) !== normalize(query.familia)) {
    return false;
  }

  if (query.stock === "disponible" && !item.availableForSale) {
    return false;
  }

  if (!query.q) return true;

  const haystack = normalize(
    [
      item.name,
      item.sku,
      item.category,
      item.note,
      item.details,
      item.fit,
      item.origin,
      item.condition,
    ].join(" "),
  );

  return normalize(query.q)
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

function relevanceScore(item: CatalogItem, q: string): number {
  if (!q) return 0;
  const needle = normalize(q);
  const name = normalize(item.name);
  const sku = normalize(item.sku);

  if (sku === needle) return 100;
  if (name === needle) return 90;
  if (sku.includes(needle)) return 80;
  if (name.startsWith(needle)) return 70;
  if (name.includes(needle)) return 60;
  if (normalize(item.category).includes(needle)) return 40;
  return 10;
}

function comparePrice(a: CatalogItem, b: CatalogItem, direction: 1 | -1): number {
  const av = a.priceAmount;
  const bv = b.priceAmount;
  if (av == null && bv == null) return 0;
  if (av == null) return 1;
  if (bv == null) return -1;
  return (av - bv) * direction;
}

export function filterCatalog(
  items: CatalogItem[],
  query: InventoryQuery,
): CatalogItem[] {
  return items.filter((item) => matchesQuery(item, query));
}

export function filterAndSortCatalog(
  items: CatalogItem[],
  query: InventoryQuery,
): CatalogItem[] {
  const matched = filterCatalog(items, query);
  if (query.orden === "nuevos") return matched.toReversed();

  return matched.toSorted((a, b) => {
    switch (query.orden) {
      case "precio-asc":
        return comparePrice(a, b, 1) || a.name.localeCompare(b.name, "es");
      case "precio-desc":
        return comparePrice(a, b, -1) || a.name.localeCompare(b.name, "es");
      case "az":
        return a.name.localeCompare(b.name, "es");
      case "za":
        return b.name.localeCompare(a.name, "es");
      case "relevancia":
      default:
        if (!query.q) return 0;
        return relevanceScore(b, query.q) - relevanceScore(a, query.q);
    }
  });
}

export function paginateCatalog(
  items: CatalogItem[],
  pagina: number,
  truncated = false,
): InventoryPage {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE) || 1);
  const current = Math.min(Math.max(pagina, 1), total === 0 ? 1 : totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = items.slice(start, start + PAGE_SIZE);

  return {
    items: pageItems,
    total,
    pagina: current,
    totalPages: total === 0 ? 1 : totalPages,
    from: total === 0 ? 0 : start + 1,
    to: start + pageItems.length,
    truncated,
  };
}

export function shopifySearchQuery(query: InventoryQuery): string {
  const parts: string[] = [];
  const term = query.q.replace(/[:()"]+/g, " ").replace(/\s+/g, " ").trim();

  if (term) parts.push(term);
  if (query.stock === "disponible") parts.push("available_for_sale:true");

  return parts.join(" AND ");
}

export function shopifySort(
  query: InventoryQuery,
): { sortKey: string; reverse: boolean } {
  switch (query.orden) {
    case "precio-asc":
      return { sortKey: "PRICE", reverse: false };
    case "precio-desc":
      return { sortKey: "PRICE", reverse: true };
    case "az":
      return { sortKey: "TITLE", reverse: false };
    case "za":
      return { sortKey: "TITLE", reverse: true };
    case "nuevos":
      return { sortKey: "CREATED_AT", reverse: true };
    case "relevancia":
    default:
      return query.q
        ? { sortKey: "RELEVANCE", reverse: false }
        : { sortKey: "BEST_SELLING", reverse: false };
  }
}

export function paginationItems(
  current: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) items.push("ellipsis");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);
  return items;
}
