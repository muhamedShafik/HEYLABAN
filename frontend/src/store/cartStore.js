import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  // cart items keyed by product id
  products: {},
  paymentMethod: "cash",
  cashReceived: "",

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setCashReceived: (value) => set({ cashReceived: value }),

  addToCart: (productId, product) => {
    set((state) => {
      const existing = state.products[productId];

      return {
        products: {
          ...state.products,
          [productId]: existing
            ? {
                ...existing,
                qty: existing.qty + 1,
              }
            : {
                id: product.id,
                name: product.name,
                description: product.description || "",
                price: Number(product.price),
                qty: 1,
              },
        },
      };
    });
  },

  increaseQty: (productId) =>
    set((state) => {
      const existing = state.products[productId];
      if (!existing) return state;

      return {
        products: {
          ...state.products,
          [productId]: {
            ...existing,
            qty: existing.qty + 1,
          },
        },
      };
    }),

  decreaseQty: (productId) =>
    set((state) => {
      const existing = state.products[productId];
      if (!existing) return state;

      if (existing.qty <= 1) {
        const updatedProducts = { ...state.products };
        delete updatedProducts[productId];
        return { products: updatedProducts };
      }

      return {
        products: {
          ...state.products,
          [productId]: {
            ...existing,
            qty: existing.qty - 1,
          },
        },
      };
    }),

  clearCart: () => set({ products: {} }),

  getCartItems: () => {
    const { products } = get();

    return Object.values(products).map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description || "",
      total: product.qty * product.price,
      quantity: product.qty,
      price: product.price,
    }));
  },

  getSubtotal: () => {
    const { products } = get();

    return Object.values(products).reduce(
      (sum, product) => sum + product.price * product.qty,
      0
    );
  },

  getTotal: () => {
    return get().getSubtotal();
  },

  getChange: () => {
    const total = get().getTotal();
    const received = Number(get().cashReceived || 0);
    return Math.max(0, received - total);
  },

  resetAfterPayment: () =>
    set({
      products: {},
      paymentMethod: "cash",
      cashReceived: "",
    }),
}));