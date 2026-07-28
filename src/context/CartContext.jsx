import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const CartContext = createContext(null);

// Module-level constant: passing a fresh [] inline would give useLocalStorage a
// new `initialValue` every render and re-subscribe its listeners each time.
const EMPTY_CART = [];

const GST_RATE = 0.05;
const FREE_DELIVERY_ABOVE = 500;
const DELIVERY_FEE = 49;

// Only the fields the cart actually needs. Keeping the snapshot small means a
// stale localStorage entry can't drag a whole outdated menu item along with it.
const toCartItem = (item, qty) => ({
  id: item.id,
  name: item.name,
  price: item.price,
  image: item.image,
  category: item.category ?? "Add-on",
  qty,
});

export const CartProvider = ({ children }) => {
  const [stored, setStored] = useLocalStorage("cafebloom:cart", EMPTY_CART);

  // localStorage is user-writable, so never trust its shape.
  const items = useMemo(() => {
    if (!Array.isArray(stored)) return EMPTY_CART;
    return stored.filter(
      (i) =>
        i &&
        typeof i.id !== "undefined" &&
        Number.isFinite(i.price) &&
        Number.isFinite(i.qty) &&
        i.qty > 0
    );
  }, [stored]);

  const addItem = (item, qty = 1) => {
    setStored((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      if (list.some((i) => i.id === item.id)) {
        return list.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...list, toCartItem(item, qty)];
    });
  };

  const setQty = (id, qty) => {
    setStored((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      if (qty <= 0) return list.filter((i) => i.id !== id);
      return list.map((i) => (i.id === id ? { ...i, qty } : i));
    });
  };

  const changeQty = (id, delta) => {
    const current = items.find((i) => i.id === id);
    setQty(id, (current?.qty ?? 0) + delta);
  };

  const removeItem = (id) => setQty(id, 0);

  const clearCart = () => setStored(EMPTY_CART);

  const getQty = (id) => items.find((i) => i.id === id)?.qty ?? 0;

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const delivery =
      subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
    const taxes = Math.round(subtotal * GST_RATE);
    return {
      subtotal,
      count,
      delivery,
      taxes,
      total: subtotal + taxes + delivery,
      freeDeliveryAbove: FREE_DELIVERY_ABOVE,
      amountToFreeDelivery: Math.max(0, FREE_DELIVERY_ABOVE - subtotal),
    };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQty,
      changeQty,
      clearCart,
      getQty,
      isEmpty: items.length === 0,
      ...totals,
    }),
    // The mutators close over setStored, which useLocalStorage recreates each
    // render; `items`/`totals` are what consumers actually re-render on, and
    // both change whenever the stored value does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a <CartProvider>");
  return ctx;
};
