import "server-only";

import { fetchCart } from "@/lib/shopify/cart";
import { readCartId } from "@/lib/shopify/cart-cookie";
import { withSilentSso } from "@/lib/shopify/checkout";
import { isCustomerSignedIn } from "@/lib/shopify/customer-session";
import type { CartView } from "@/lib/shopify/cart-types";

export async function withCheckoutSession(cart: CartView): Promise<CartView> {
  if (!(await isCustomerSignedIn())) return cart;
  return { ...cart, checkoutUrl: withSilentSso(cart.checkoutUrl) };
}

export async function loadCart(): Promise<CartView | null> {
  try {
    const cartId = await readCartId();
    if (!cartId) return null;

    const cart = await fetchCart(cartId);
    if (!cart) return null;

    return withCheckoutSession(cart);
  } catch (error) {
    console.error("Shopify cart:", error);
    return null;
  }
}
