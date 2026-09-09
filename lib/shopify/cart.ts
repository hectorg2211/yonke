import "server-only";

import { formatMoney, type Money } from "@/lib/shopify/money";
import { storefrontFetch } from "@/lib/shopify/storefront";
import type { CartLineView, CartView } from "@/lib/shopify/cart-types";

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          sku
          product {
            title
            handle
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

const CART_QUERY = /* GraphQL */ `
  query StorefrontCart($id: ID!) {
    cart(id: $id) {
      ${CART_FIELDS}
    }
  }
`;

const CART_CREATE = /* GraphQL */ `
  mutation StorefrontCartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_BUYER_IDENTITY = /* GraphQL */ `
  mutation StorefrontCartBuyerIdentityUpdate(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
  ) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD = /* GraphQL */ `
  mutation StorefrontCartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE = /* GraphQL */ `
  mutation StorefrontCartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE = /* GraphQL */ `
  mutation StorefrontCartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

type UserError = {
  field?: string[] | null;
  message: string;
};

type VariantMerchandise = {
  id: string;
  title: string;
  sku: string | null;
  product: {
    title: string;
    handle: string;
    featuredImage: {
      url: string;
      altText: string | null;
    } | null;
  };
};

type CartLineNode = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: VariantMerchandise | Record<string, never>;
};

type CartNode = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: {
    nodes: CartLineNode[];
  };
};

type CartMutationPayload = {
  cart: CartNode | null;
  userErrors: UserError[];
};

function firstError(errors?: UserError[]): string | null {
  const message = errors?.find((error) => error.message)?.message;
  return message ?? null;
}

function isVariant(merchandise: CartLineNode["merchandise"]): merchandise is VariantMerchandise {
  return "id" in merchandise && "product" in merchandise;
}

function mapLine(line: CartLineNode): CartLineView | null {
  if (!isVariant(line.merchandise)) return null;

  const variantTitle =
    line.merchandise.title && line.merchandise.title !== "Default Title"
      ? line.merchandise.title
      : null;

  return {
    id: line.id,
    quantity: line.quantity,
    title: line.merchandise.product.title,
    variantTitle,
    handle: line.merchandise.product.handle,
    sku: line.merchandise.sku,
    image: line.merchandise.product.featuredImage?.url ?? null,
    imageAlt:
      line.merchandise.product.featuredImage?.altText ||
      line.merchandise.product.title,
    price: formatMoney(line.cost.totalAmount),
  };
}

export function mapCart(cart: CartNode): CartView {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: formatMoney(cart.cost.subtotalAmount),
    total: formatMoney(cart.cost.totalAmount),
    lines: cart.lines.nodes
      .map(mapLine)
      .filter((line): line is CartLineView => line !== null),
  };
}

function unwrapMutation(
  payload: CartMutationPayload | null | undefined,
  fallback: string,
): CartView {
  const userError = firstError(payload?.userErrors);
  if (userError) {
    throw new Error(userError);
  }
  if (!payload?.cart) {
    throw new Error(fallback);
  }
  return mapCart(payload.cart);
}

export async function fetchCart(cartId: string): Promise<CartView | null> {
  const result = await storefrontFetch<{ cart: CartNode | null }>(CART_QUERY, {
    id: cartId,
  });
  return result.data?.cart ? mapCart(result.data.cart) : null;
}

export async function createCart(
  merchandiseId: string,
  quantity: number,
  customerAccessToken?: string | null,
): Promise<CartView> {
  const input: {
    lines: { merchandiseId: string; quantity: number }[];
    buyerIdentity?: { customerAccessToken: string };
  } = {
    lines: [{ merchandiseId, quantity }],
  };
  if (customerAccessToken) {
    input.buyerIdentity = { customerAccessToken };
  }

  try {
    const result = await storefrontFetch<{ cartCreate: CartMutationPayload }>(
      CART_CREATE,
      { input },
    );
    return unwrapMutation(result.data?.cartCreate, "No se pudo crear el carrito.");
  } catch (error) {
    if (!customerAccessToken) throw error;
    const result = await storefrontFetch<{ cartCreate: CartMutationPayload }>(
      CART_CREATE,
      { input: { lines: [{ merchandiseId, quantity }] } },
    );
    return unwrapMutation(result.data?.cartCreate, "No se pudo crear el carrito.");
  }
}

export async function updateCartBuyerIdentity(
  cartId: string,
  customerAccessToken: string,
): Promise<CartView> {
  const result = await storefrontFetch<{
    cartBuyerIdentityUpdate: CartMutationPayload;
  }>(CART_BUYER_IDENTITY, {
    cartId,
    buyerIdentity: { customerAccessToken },
  });
  return unwrapMutation(
    result.data?.cartBuyerIdentityUpdate,
    "No se pudo asociar la cuenta al carrito.",
  );
}

export async function addCartLines(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<CartView> {
  const result = await storefrontFetch<{ cartLinesAdd: CartMutationPayload }>(
    CART_LINES_ADD,
    { cartId, lines: [{ merchandiseId, quantity }] },
  );
  return unwrapMutation(result.data?.cartLinesAdd, "No se pudo agregar al carrito.");
}

export async function updateCartLines(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<CartView> {
  const result = await storefrontFetch<{ cartLinesUpdate: CartMutationPayload }>(
    CART_LINES_UPDATE,
    { cartId, lines: [{ id: lineId, quantity }] },
  );
  return unwrapMutation(
    result.data?.cartLinesUpdate,
    "No se pudo actualizar el carrito.",
  );
}

export async function removeCartLines(
  cartId: string,
  lineId: string,
): Promise<CartView> {
  const result = await storefrontFetch<{ cartLinesRemove: CartMutationPayload }>(
    CART_LINES_REMOVE,
    { cartId, lineIds: [lineId] },
  );
  return unwrapMutation(
    result.data?.cartLinesRemove,
    "No se pudo quitar la pieza.",
  );
}

export function isMissingCartError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return (
    message.includes("does not exist") ||
    message.includes("specified cart") ||
    message.includes("cart not found") ||
    message.includes("invalid") && message.includes("cart")
  );
}
