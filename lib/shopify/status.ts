import "server-only";

import { getShopifyEnv } from "@/lib/shopify/env";
import { ShopifyConfigError, storefrontFetch } from "@/lib/shopify/storefront";
import type { ShopifyConnectionStatus } from "@/lib/shopify/types";

const SHOP_QUERY = /* GraphQL */ `
  query ShopifyConnectionCheck {
    shop {
      name
      primaryDomain {
        host
        url
      }
    }
  }
`;

type ShopQueryData = {
  shop: {
    name: string;
    primaryDomain: {
      host: string;
      url: string;
    } | null;
  };
};

export type { ShopifyConnectionStatus } from "@/lib/shopify/types";

export async function getShopifyConnectionStatus(): Promise<ShopifyConnectionStatus> {
  const env = getShopifyEnv();

  if (!env.ok) {
    return {
      ok: false,
      configured: false,
      missing: env.missing,
        error:
          env.domain && /admin\.shopify\.com/i.test(env.domain)
            ? "Usa tu-tienda.myshopify.com, no admin.shopify.com."
            : "Faltan variables de entorno de Shopify.",
      domain: env.domain,
      apiVersion: env.apiVersion,
    };
  }

  try {
    const result = await storefrontFetch<ShopQueryData>(SHOP_QUERY);
    const graphqlError = result.errors?.map((error) => error.message).join("; ");

    if (graphqlError || !result.data?.shop) {
      return {
        ok: false,
        configured: true,
        missing: [],
        error: graphqlError || "La tienda no devolvió datos.",
        domain: env.config.domain,
        apiVersion: env.config.apiVersion,
      };
    }

    return {
      ok: true,
      configured: true,
      shopName: result.data.shop.name,
      domain: env.config.domain,
      host: result.data.shop.primaryDomain?.host ?? null,
      apiVersion: env.config.apiVersion,
    };
  } catch (error) {
    const message =
      error instanceof ShopifyConfigError
        ? error.message
        : error instanceof Error
          ? error.message
          : "No se pudo contactar Shopify.";

    return {
      ok: false,
      configured: true,
      missing: error instanceof ShopifyConfigError ? error.missing : [],
      error: message,
      domain: env.config.domain,
      apiVersion: env.config.apiVersion,
    };
  }
}
