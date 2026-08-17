import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string; // Unique ID for the cart item (since same product can be added with different variants)
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variants: Record<string, string>;
  addons: any[];
  notes: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        // Simple unique ID generation for cart items
        const id = Math.random().toString(36).substring(2, 9);
        return { items: [...state.items, { ...item, id }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item => {
          if (item.id === id) {
            return {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity
            };
          }
          return item;
        })
      })),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => get().items.reduce((total, item) => total + item.totalPrice, 0),
    }),
    {
      name: 'qr-resto-cart',
    }
  )
);
