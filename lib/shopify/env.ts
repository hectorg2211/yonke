import "server-only";

const DEFAULT_API_VERSION = "2026-01";

export type ShopifyEnv = {
  domain: string;
  storefrontToken: string;
  privateToken: string | null;
  apiVersion: string;
};

export type ShopifyEnvResult =
  | { ok: true; config: ShopifyEnv }
  | { ok: false; missing: string[]; apiVersion: string; domain: string | null };

function read(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function isPlaceholder(value: string): boolean {
  return /your-store|your-public-storefront-token|changeme|replace-me/i.test(
    value,
  );
}

function isAdminHost(value: string): boolean {
  return /admin\.shopify\.com/i.test(value);
}

export function normalizeStoreDomain(value: string): string {
  return value
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/\.myshopify\.com\.myshopify\.com$/i, ".myshopify.com");
}

export function getShopifyEnv(): ShopifyEnvResult {
  const apiVersion = read("SHOPIFY_STOREFRONT_API_VERSION") ?? DEFAULT_API_VERSION;
  const rawDomain = read("SHOPIFY_STORE_DOMAIN");
  const storefrontToken = read("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  const privateToken = read("SHOPIFY_STOREFRONT_PRIVATE_TOKEN") ?? null;
  const missing: string[] = [];

  if (!rawDomain || isPlaceholder(rawDomain) || isAdminHost(rawDomain)) {
    missing.push("SHOPIFY_STORE_DOMAIN");
  }
  if (!storefrontToken || isPlaceholder(storefrontToken)) {
    missing.push("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  }

  if (missing.length > 0 || !rawDomain || !storefrontToken) {
    return {
      ok: false,
      missing,
      apiVersion,
      domain: rawDomain ? normalizeStoreDomain(rawDomain) : null,
    };
  }

  return {
    ok: true,
    config: {
      domain: normalizeStoreDomain(rawDomain),
      storefrontToken,
      privateToken,
      apiVersion,
    },
  };
}

export function storefrontEndpoint(config: Pick<ShopifyEnv, "domain" | "apiVersion">): string {
  return `https://${config.domain}/api/${config.apiVersion}/graphql.json`;
}
