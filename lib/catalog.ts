import "server-only";

import { catalog, getProductBySlug, type CatalogItem } from "@/lib/site";
import {
  filterAndSortCatalog,
  filterCatalog,
  paginateCatalog,
  shopifySearchQuery,
  shopifySort,
  type InventoryPage,
  type InventoryQuery,
} from "@/lib/inventory";
import {
  getStorefrontProductByHandle,
  listStorefrontProducts,
  searchStorefrontProducts,
} from "@/lib/shopify/products";

export async function getCatalog(): Promise<CatalogItem[]> {
  try {
    const live = await listStorefrontProducts();
    if (live.length > 0) return live;
  } catch (error) {
    console.error("Shopify catalog:", error);
  }

  return catalog;
}

export async function searchCatalog(
  query: InventoryQuery,
): Promise<InventoryPage> {
  try {
    const live = await listStorefrontProducts();
    if (live.length > 0) {
      const { sortKey, reverse } = shopifySort(query);
      const searched = await searchStorefrontProducts(
        shopifySearchQuery(query),
        sortKey,
        reverse,
      );
      const keepShopifyOrder =
        query.orden === "relevancia" || query.orden === "nuevos";
      const items = keepShopifyOrder
        ? filterCatalog(searched.items, query)
        : filterAndSortCatalog(searched.items, query);
      return paginateCatalog(items, query.pagina, searched.truncated);
    }
  } catch (error) {
    console.error("Shopify catalog search:", error);
  }

  return paginateCatalog(filterAndSortCatalog(catalog, query), query.pagina);
}

export async function getCatalogProduct(
  slug: string,
): Promise<CatalogItem | null> {
  const key = decodeURIComponent(slug).toLowerCase();

  try {
    const byHandle = await getStorefrontProductByHandle(key);
    if (byHandle) return byHandle;

    const live = await listStorefrontProducts();
    if (live.length > 0) {
      return (
        live.find(
          (item) => item.handle === key || item.sku.toLowerCase() === key,
        ) ?? null
      );
    }
  } catch (error) {
    console.error("Shopify product:", error);
  }

  return getProductBySlug(key) ?? null;
}

export async function relatedCatalog(
  item: CatalogItem,
  limit = 3,
): Promise<CatalogItem[]> {
  const items = await getCatalog();
  const rest = items.filter((entry) => entry.handle !== item.handle);
  const same = rest.filter((entry) => entry.category === item.category);
  return [...same, ...rest.filter((entry) => !same.includes(entry))].slice(
    0,
    limit,
  );
}
