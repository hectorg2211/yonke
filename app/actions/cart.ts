"use server";

import {
  addCartLines,
  createCart,
  fetchCart,
  isMissingCartError,
  removeCartLines,
  updateCartLines,
} from "@/lib/shopify/cart";
import { withSilentSso } from "@/lib/shopify/checkout";
import { clearCartId, readCartId, writeCartId } from "@/lib/shopify/cart-cookie";
import {
  getCustomerAccessToken,
  isCustomerSignedIn,
} from "@/lib/shopify/customer-session";
import type { CartActionResult, CartView } from "@/lib/shopify/cart-types";

const VARIANT_PREFIX = "gid://shopify/ProductVariant/";

function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(50, Math.max(1, Math.floor(value)));
}

function fail(error: unknown, fallback: string): CartActionResult {
  return {
    ok: false,
    error: error instanceof Error ? error.message : fallback,
  };
}

async function withCheckoutSession(cart: CartView): Promise<CartView> {
  if (!(await isCustomerSignedIn())) return cart;
  return { ...cart, checkoutUrl: withSilentSso(cart.checkoutUrl) };
}

async function persist(cart: CartView): Promise<CartView> {
  await writeCartId(cart.id);
  return withCheckoutSession(cart);
}

export async function getCart(): Promise<CartView | null> {
  try {
    const cartId = await readCartId();
    if (!cartId) return null;

    const cart = await fetchCart(cartId);
    if (!cart) {
      await clearCartId();
      return null;
    }

    return withCheckoutSession(cart);
  } catch (error) {
    console.error("Shopify cart:", error);
    return null;
  }
}

export async function addToCart(
  variantId: string,
  quantity = 1,
): Promise<CartActionResult> {
  if (!variantId.startsWith(VARIANT_PREFIX)) {
    return { ok: false, error: "Variante inválida." };
  }

  const qty = clampQuantity(quantity);

  try {
    const [cartId, customerAccessToken] = await Promise.all([
      readCartId(),
      getCustomerAccessToken(),
    ]);

    if (!cartId) {
      return {
        ok: true,
        cart: await persist(await createCart(variantId, qty, customerAccessToken)),
      };
    }

    try {
      return {
        ok: true,
        cart: await persist(await addCartLines(cartId, variantId, qty)),
      };
    } catch (error) {
      if (!isMissingCartError(error)) throw error;
      await clearCartId();
      return {
        ok: true,
        cart: await persist(await createCart(variantId, qty, customerAccessToken)),
      };
    }
  } catch (error) {
    return fail(error, "No se pudo agregar al carrito.");
  }
}

export async function updateCartLine(
  lineId: string,
  quantity: number,
): Promise<CartActionResult> {
  if (!lineId.startsWith("gid://shopify/")) {
    return { ok: false, error: "Línea inválida." };
  }

  const cartId = await readCartId();
  if (!cartId) {
    return { ok: false, error: "No hay carrito activo." };
  }

  try {
    if (quantity < 1) {
      return {
        ok: true,
        cart: await persist(await removeCartLines(cartId, lineId)),
      };
    }

    return {
      ok: true,
      cart: await persist(
        await updateCartLines(cartId, lineId, clampQuantity(quantity)),
      ),
    };
  } catch (error) {
    return fail(error, "No se pudo actualizar el carrito.");
  }
}

export async function removeCartLine(lineId: string): Promise<CartActionResult> {
  return updateCartLine(lineId, 0);
}
