import Link from "next/link";
import {
  inventoryHref,
  paginationItems,
  type InventoryPage,
  type InventoryQuery,
} from "@/lib/inventory";

const controlClass =
  "stamp grid min-h-11 min-w-11 place-items-center border px-3 text-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";

export function InventoryPagination({
  query,
  page,
}: {
  query: InventoryQuery;
  page: InventoryPage;
}) {
  if (page.totalPages <= 1 || page.total === 0) return null;

  const previous = page.pagina > 1 ? page.pagina - 1 : null;
  const next = page.pagina < page.totalPages ? page.pagina + 1 : null;

  return (
    <nav
      className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row"
      aria-label="Paginación del inventario"
    >
      {previous ? (
        <Link
          href={`${inventoryHref(query, { pagina: previous })}#inventario-resultados`}
          className={`${controlClass} border-line text-cream hover:border-amber hover:text-amber`}
        >
          Anterior
        </Link>
      ) : (
        <span className={`${controlClass} border-line text-steel/50`}>Anterior</span>
      )}

      <ol className="flex flex-wrap items-center justify-center gap-1">
        {paginationItems(page.pagina, page.totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <li
              key={`ellipsis-${index}`}
              className="stamp px-2 text-[10px] text-steel"
            >
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={`${inventoryHref(query, { pagina: item })}#inventario-resultados`}
                aria-current={item === page.pagina ? "page" : undefined}
                className={`${controlClass} ${
                  item === page.pagina
                    ? "border-amber bg-amber text-oil"
                    : "border-line text-cream hover:border-amber hover:text-amber"
                }`}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ol>

      {next ? (
        <Link
          href={`${inventoryHref(query, { pagina: next })}#inventario-resultados`}
          className={`${controlClass} border-line text-cream hover:border-amber hover:text-amber`}
        >
          Siguiente
        </Link>
      ) : (
        <span className={`${controlClass} border-line text-steel/50`}>Siguiente</span>
      )}
    </nav>
  );
}
