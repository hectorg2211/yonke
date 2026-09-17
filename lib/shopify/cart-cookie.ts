import "server-only";

import { cookies } from "next/headers";
import { getShopifyEnv } from "@/lib/shopify/env";

export const CART_COOKIE = "yonke_cart_id";

export const cartCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 14,
};

type StoredCartCookie = {
  d: string;
  id: string;
};

function storeDomain(): string | null {
  const env = getShopifyEnv();
  return env.ok ? env.config.domain : null;
}

function parseCartCookie(value: string): StoredCartCookie | string | null {
  if (value.startsWith("{")) {
    try {
      const parsed = JSON.parse(value) as StoredCartCookie;
      if (typeof parsed.id !== "string" || !parsed.id) return null;
      if (typeof parsed.d !== "string") return { d: "", id: parsed.id };
      return parsed;
    } catch {
      return null;
    }
  }
  return value || null;
}

export async function readCartId(): Promise<string | null> {
  const jar = await cookies();
  const raw = jar.get(CART_COOKIE)?.value;
  if (!raw) return null;

  const parsed = parseCartCookie(decodeURIComponent(raw));
  if (!parsed) return null;

  const domain = storeDomain();
  if (typeof parsed === "string") return parsed;
  if (domain && parsed.d && parsed.d !== domain) return null;
  return parsed.id;
}

export async function writeCartId(cartId: string): Promise<void> {
  const jar = await cookies();
  const domain = storeDomain();
  const value = domain ? JSON.stringify({ d: domain, id: cartId }) : cartId;
  jar.set(CART_COOKIE, encodeURIComponent(value), cartCookieOptions);
}

export async function clearCartId(): Promise<void> {
  const jar = await cookies();
  jar.set(CART_COOKIE, "", { ...cartCookieOptions, maxAge: 0 });
}
