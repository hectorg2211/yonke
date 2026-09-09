export type CartLineView = {
  id: string;
  quantity: number;
  title: string;
  variantTitle: string | null;
  handle: string;
  sku: string | null;
  image: string | null;
  imageAlt: string;
  price: string;
};

export type CartView = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: string;
  total: string;
  lines: CartLineView[];
};

export type CartActionResult =
  | { ok: true; cart: CartView }
  | { ok: false; error: string };
