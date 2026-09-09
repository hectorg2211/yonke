"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  addToCart,
  getCart,
  removeCartLine,
  updateCartLine,
} from "@/app/actions/cart";
import type { CartView } from "@/lib/shopify/cart-types";

type CartContextValue = {
  cart: CartView | null;
  open: boolean;
  pending: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<boolean>;
  setLineQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  initialCart,
}: {
  children: ReactNode;
  initialCart: CartView | null;
}) {
  const [cart, setCart] = useState<CartView | null>(initialCart);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(async () => {
    const latest = await getCart();
    setCart(latest);
    return latest;
  }, []);

  const openCart = useCallback(() => {
    setOpen(true);
    startTransition(() => {
      void refresh();
    });
  }, [refresh]);

  const closeCart = useCallback(() => {
    setOpen(false);
    setError(null);
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setError(null);
      const result = await addToCart(variantId, quantity);
      if (!result.ok) {
        setError(result.error);
        setOpen(true);
        return false;
      }
      setCart(result.cart);
      setOpen(true);
      return true;
    },
    [],
  );

  const setLineQuantity = useCallback(async (lineId: string, quantity: number) => {
    setError(null);
    const result = await updateCartLine(lineId, quantity);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCart(result.cart);
  }, []);

  const removeLine = useCallback(async (lineId: string) => {
    setError(null);
    const result = await removeCartLine(lineId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCart(result.cart);
  }, []);

  const value = useMemo(
    () => ({
      cart,
      open,
      pending,
      error,
      openCart,
      closeCart,
      addItem,
      setLineQuantity,
      removeLine,
    }),
    [
      cart,
      open,
      pending,
      error,
      openCart,
      closeCart,
      addItem,
      setLineQuantity,
      removeLine,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
