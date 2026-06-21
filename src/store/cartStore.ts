import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductSalesDTO } from '@/types';

export interface CartLine {
  product: ProductSalesDTO;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  add: (product: ProductSalesDTO, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.product.id === product.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.product.id === product.id ? { ...l, quantity: l.quantity + quantity } : l
              ),
            };
          }
          return { lines: [...state.lines, { product, quantity }] };
        }),
      remove: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.product.id !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.product.id === productId ? { ...l, quantity } : l
          ),
        })),
      clear: () => set({ lines: [] }),
      total: () => get().lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
    }),
    { name: 'nori-cart' }
  )
);
