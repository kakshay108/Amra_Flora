"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type BouquetConfig } from "@/lib/catalog";
import { priceBouquet } from "@/lib/pricing";

export type CartItem = {
  id: string;
  name: string;
  config: BouquetConfig;
  qty: number;
  /** unit price in INR, recomputed from config at add time */
  unitPrice: number;
  /** data-URL thumbnail captured from the 3D canvas */
  thumbnail: string | null;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "id" | "unitPrice">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              id: crypto.randomUUID(),
              unitPrice: priceBouquet(item.config).total,
            },
          ],
        })),

      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: Math.max(1, qty) } : i
          ),
        })),

      clear: () => set({ items: [] }),

      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.unitPrice * i.qty, 0),
    }),
    { name: "amra-cart" }
  )
);
