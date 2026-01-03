import { create } from "zustand";

const STORAGE_KEY = "cart_items_v1";

function findIndexById(items, id) {
  return items.findIndex((i) => i.id === id);
}

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

const useCart = create((set, get) => ({
  items: loadItems(),
  addToCart: (product) => {
    set((state) => {
      const items = [...state.items];
      const idx = findIndexById(items, product.id);
      if (idx > -1) {
        items[idx] = { ...items[idx], quantity: items[idx].quantity + 1 };
      } else {
        items.push({ ...product, quantity: 1 });
      }
      return { items };
    });
  },
  removeFromCart: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearCart: () => set({ items: [] }),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),
  total: () =>
    get().items.reduce(
      (s, it) => s + (parseFloat(it.price) || 0) * (it.quantity || 1),
      0
    ),
}));

// persist on changes
useCart.subscribe((state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items || []));
  } catch (e) {
    // ignore
  }
});

export default useCart;
