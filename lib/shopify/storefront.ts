import "server-only";

import {
  getShopifyEnv,
  storefrontEndpoint,
  type ShopifyEnv,
} from "@/lib/shopify/env";

export type StorefrontError = {
  message: string;
};

export type StorefrontResult<T> = {
  data?: T;
  errors?: StorefrontError[];
};

export class ShopifyConfigError extends Error {
  missing: string[];

  constructor(missing: string[]) {
    super(`Missing Shopify env: ${missing.join(", ")}`);
    this.name = "ShopifyConfigError";
    this.missing = missing;
  }
}

function headersFor(config: ShopifyEnv): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": config.storefrontToken,
  };

  if (config.privateToken) {
    headers["Shopify-Storefront-Private-Token"] = config.privateToken;
  }

  return headers;
}

export async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<StorefrontResult<T>> {
  const env = getShopifyEnv();
  if (!env.ok) {
    throw new ShopifyConfigError(env.missing);
  }

  const response = await fetch(storefrontEndpoint(env.config), {
    method: "POST",
    headers: headersFor(env.config),
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });

  let payload: StorefrontResult<T>;
  try {
    payload = (await response.json()) as StorefrontResult<T>;
  } catch {
    throw new Error(
      response.status === 401
        ? "Token o dominio inválido. Usa tu-tienda.myshopify.com y el token de Storefront."
        : `Storefront API ${response.status}: respuesta no válida`,
    );
  }

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  if (!response.ok) {
    const graphqlMessage = payload.errors?.map((error) => error.message).join("; ");
    const message =
      graphqlMessage ||
      (response.status === 401
        ? "Token o dominio inválido (401)."
        : `Storefront API ${response.status}`);
    throw new Error(message);
  }

  return payload;
}
