import "server-only";

import { cache } from "react";
import type { CatalogItem } from "@/lib/site";
import { formatMoney, type Money } from "@/lib/shopify/money";
import { storefrontFetch } from "@/lib/shopify/storefront";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1400&q=80";

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  productType
  vendor
  tags
  featuredImage {
    url
    altText
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  variants(first: 8) {
    nodes {
      id
      title
      sku
      availableForSale
      price {
        amount
        currencyCode
      }
    }
  }
`;

const PRODUCTS_QUERY = /* GraphQL */ `
  query StorefrontProducts($first: Int!) {
    products(first: $first) {
      nodes {
        ${PRODUCT_FIELDS}
      }
    }
  }
`;

const SEARCH_PRODUCTS_QUERY = /* GraphQL */ `
  query StorefrontProductSearch(
    $first: Int!
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
      }
      nodes {
        ${PRODUCT_FIELDS}
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query StorefrontProductByHandle($handle: String!) {
    product(handle: $handle) {
      ${PRODUCT_FIELDS}
    }
  }
`;

type StorefrontProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  priceRange: {
    minVariantPrice: Money;
  };
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      sku: string | null;
      availableForSale: boolean;
      price: Money;
    }>;
  };
};

type ProductsQueryData = {
  products: {
    nodes: StorefrontProductNode[];
  };
};

type ProductSearchQueryData = {
  products: {
    pageInfo: {
      hasNextPage: boolean;
    };
    nodes: StorefrontProductNode[];
  };
};

type ProductByHandleData = {
  product: StorefrontProductNode | null;
};

export function mapStorefrontProduct(product: StorefrontProductNode): CatalogItem {
  const variant = product.variants.nodes[0];
  const available = variant?.availableForSale ?? false;
  const sku = variant?.sku?.trim();
  const family = product.productType.trim() || "Pieza";
  const amount = Number.parseFloat(product.priceRange.minVariantPrice.amount);

  return {
    handle: product.handle,
    sku: sku || product.handle,
    name: product.title,
    category: family,
    price: formatMoney(product.priceRange.minVariantPrice),
    priceAmount: Number.isFinite(amount) ? amount : null,
    note: product.description || "Pieza de tractocamión",
    image: product.featuredImage?.url ?? FALLBACK_IMAGE,
    imageAlt: product.featuredImage?.altText || product.title,
    condition: available ? "Disponible" : "Sin existencia",
    origin: product.vendor || "Patio Otay",
    stock: available ? "En venta" : "Agotada",
    fit: family === "Pieza" ? "Tractocamión" : family,
    details: product.description || product.title,
    variantId: variant?.id ?? null,
    availableForSale: available,
  };
}

export const listStorefrontProducts = cache(async (): Promise<CatalogItem[]> => {
  const result = await storefrontFetch<ProductsQueryData>(PRODUCTS_QUERY, {
    first: 50,
  });
  const nodes = result.data?.products.nodes ?? [];
  return nodes.map(mapStorefrontProduct);
});

export const searchStorefrontProducts = cache(
  async (
    query: string,
    sortKey: string,
    reverse: boolean,
  ): Promise<{ items: CatalogItem[]; truncated: boolean }> => {
    const result = await storefrontFetch<ProductSearchQueryData>(
      SEARCH_PRODUCTS_QUERY,
      {
        first: 250,
        sortKey,
        reverse,
        ...(query ? { query } : {}),
      },
    );
    const connection = result.data?.products;
    return {
      items: (connection?.nodes ?? []).map(mapStorefrontProduct),
      truncated: connection?.pageInfo.hasNextPage ?? false,
    };
  },
);

export const getStorefrontProductByHandle = cache(
  async (handle: string): Promise<CatalogItem | null> => {
    const result = await storefrontFetch<ProductByHandleData>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle },
    );
    const product = result.data?.product;
    return product ? mapStorefrontProduct(product) : null;
  },
);
