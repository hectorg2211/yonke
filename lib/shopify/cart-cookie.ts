import "server-only";

import { cookies } from "next/headers";

export const CART_COOKIE = "yonke_cart_id";

export const cartCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 14,
};

export async function readCartId(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(CART_COOKIE)?.value;
  return value ? decodeURIComponent(value) : null;
}

export async function writeCartId(cartId: string): Promise<void> {
  const jar = await cookies();
  jar.set(CART_COOKIE, encodeURIComponent(cartId), cartCookieOptions);
}

export async function clearCartId(): Promise<void> {
  const jar = await cookies();
  jar.delete(CART_COOKIE);
}
