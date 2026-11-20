import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'mudiwala.cart.v1';
const WISHLIST_KEY = 'mudiwala.wishlist.v1';

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function useCart() {
  const [items, setItems] = useState(() => readStorage(STORAGE_KEY, []));
  const [wishlist, setWishlist] = useState(() => readStorage(WISHLIST_KEY, []));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart stays in memory */
    }
  }, [items]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      /* storage unavailable — wishlist stays in memory */
    }
  }, [wishlist]);

  const addItem = useCallback((productId, variantId) => {
    setItems((current) => {
      const existing = current.find(
        (item) => item.productId === productId && item.variantId === variantId,
      );
      if (existing) {
        return current.map((item) =>
          item === existing ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...current, { productId, variantId, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((productId, variantId, qty) => {
    setItems((current) => {
      if (qty <= 0) {
        return current.filter(
          (item) => !(item.productId === productId && item.variantId === variantId),
        );
      }
      return current.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, qty }
          : item,
      );
    });
  }, []);

  const increment = useCallback((productId, variantId) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, qty: item.qty + 1 }
          : item,
      ),
    );
  }, []);

  const decrement = useCallback((productId, variantId) => {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, qty: item.qty - 1 }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  }, []);

  const removeItem = useCallback((productId, variantId) => {
    setItems((current) =>
      current.filter(
        (item) => !(item.productId === productId && item.variantId === variantId),
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback((productId) => {
    let added = false;
    setWishlist((current) => {
      if (current.includes(productId)) {
        added = false;
        return current.filter((id) => id !== productId);
      }
      added = true;
      return [...current, productId];
    });
    return added;
  }, []);

  const isWishlisted = useCallback(
    (productId) => wishlist.includes(productId),
    [wishlist],
  );

  const qtyOf = useCallback(
    (productId, variantId) =>
      items.find((item) => item.productId === productId && item.variantId === variantId)
        ?.qty ?? 0,
    [items],
  );

  return {
    items,
    wishlist,
    addItem,
    setQty,
    increment,
    decrement,
    removeItem,
    clear,
    toggleWishlist,
    isWishlisted,
    qtyOf,
  };
}

export const FREE_DELIVERY_THRESHOLD = 500;
export const DELIVERY_CHARGE = 60;

export function useCartTotals(items, resolve) {
  return useMemo(() => {
    const detailed = items
      .map((item) => {
        const detail = resolve(item.productId, item.variantId);
        if (!detail) return null;
        return { ...item, ...detail, lineTotal: detail.price * item.qty };
      })
      .filter(Boolean);

    const subtotal = detailed.reduce((sum, item) => sum + item.lineTotal, 0);
    const itemCount = detailed.reduce((sum, item) => sum + item.qty, 0);
    const delivery =
      subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;

    return {
      detailed,
      subtotal,
      itemCount,
      delivery,
      total: subtotal + delivery,
      freeGap: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
    };
  }, [items, resolve]);
}
