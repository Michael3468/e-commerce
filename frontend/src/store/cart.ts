import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/product';

export interface CartItem {
  readonly productId: number;
  readonly title: string;
  readonly price: number;
  readonly quantity: number;
}

interface CartState {
  readonly items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  /** Итоговая сумма корзины в рублях. */
  getTotal: () => number;
  /** Общее количество позиций (сумма quantity). */
  getItemsCount: () => number;
}

/**
 * Стор корзины на Zustand с persist (localStorage).
 * Методы-геттеры возвращаются из состояния — они читают актуальные данные
 * через get(). Для рендера лучше использовать селекторы, напр. state.items.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.id,
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                title: product.title,
                price: product.price,
                quantity,
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item,
                ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getItemsCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
      // Персистим только товары, чтобы не сериализовать функции.
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
