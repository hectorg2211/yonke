import "server-only";

import { cache } from "react";
import { storefrontFetch } from "@/lib/shopify/storefront";

export type ShopPolicy = {
  title: string;
  handle: string;
  url: string;
  html: string;
};

const PRIVACY_POLICY_QUERY = /* GraphQL */ `
  query StorefrontPrivacyPolicy {
    shop {
      name
      privacyPolicy {
        title
        handle
        url
        body
      }
    }
  }
`;

type PrivacyPolicyData = {
  shop: {
    name: string;
    privacyPolicy: {
      title: string;
      handle: string;
      url: string;
      body: string;
    } | null;
  };
};

function stripUnsafeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(
      /<(span|div)\b[^>]*class="[^"]*(?:visually-hidden|\bhidden\b)[^"]*"[^>]*>[\s\S]*?<\/\1>/gi,
      "",
    )
    .trim();
}

function extractBody(html: string): string {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return stripUnsafeHtml(match?.[1] ?? html);
}

function fillLiquid(body: string, shopName: string): string {
  return body
    .replace(/\{\{\s*shop_name\s*\}\}/g, shopName)
    .replace(/\{\%\s*if[\s\S]*?\%\}[\s\S]*?\{\%\s*endif\s*\%\}/g, "")
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\{\%[^%]+\%\}/g, "");
}

export const getPrivacyPolicy = cache(async (): Promise<ShopPolicy | null> => {
  const result = await storefrontFetch<PrivacyPolicyData>(PRIVACY_POLICY_QUERY);
  const shop = result.data?.shop;
  const policy = shop?.privacyPolicy;
  if (!shop || !policy) return null;

  let html = "";
  try {
    const response = await fetch(policy.url, {
      headers: { Accept: "text/html" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8_000),
    });
    if (response.ok) {
      html = extractBody(await response.text());
    }
  } catch (error) {
    console.error("Shopify privacy policy page:", error);
  }

  if (!html) {
    html = stripUnsafeHtml(fillLiquid(policy.body, shop.name));
  }

  if (!html) return null;

  return {
    title: policy.title,
    handle: policy.handle,
    url: policy.url,
    html,
  };
});
