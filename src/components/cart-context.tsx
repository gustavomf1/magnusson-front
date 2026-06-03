"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { product } from "@/data/product";

export type CartItem = {
  id: string;
  name: string;
  color: string;
  size: string;
  qty: number;
  price: number;
  image: string;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "id" | "price" | "image" | "name">) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);

  const addItem: CartContextValue["addItem"] = (item) => {
    const id = `${product.id}-${item.color}-${item.size}`;

    setItems((current) => {
      const existing = current.find((entry) => entry.id === id);

      if (existing) {
        return current.map((entry) =>
          entry.id === id ? { ...entry, qty: entry.qty + item.qty } : entry
        );
      }

      return [
        ...current,
        {
          ...item,
          id,
          name: product.shortName,
          price: product.price,
          image: "/assets/polo-classic-flat.png"
        }
      ];
    });

    setOpen(true);
  };

  const updateQty = (id: string, qty: number) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
    const count = items.reduce((total, item) => total + item.qty, 0);

    return {
      items,
      isOpen,
      setOpen,
      addItem,
      updateQty,
      removeItem,
      subtotal,
      count
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider.");
  }

  return context;
}
