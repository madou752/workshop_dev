import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import cartReducer from "../features/cart/cartSlice";
import type { CartLine } from "../types/product";

// The cart lines survive a reload or a closed tab. Storage can be missing or
// blocked (private mode, disabled site data), so every access is guarded and
// the site simply starts with an empty cart when it fails.
const CART_KEY = "lahistair-cart";

function isCartLine(value: unknown): value is CartLine {
  const l = value as CartLine;
  return (
    typeof l === "object" &&
    l !== null &&
    typeof l.productId === "string" &&
    typeof l.sizeId === "string" &&
    typeof l.name === "string" &&
    typeof l.sizeLabel === "string" &&
    typeof l.priceEUR === "number" &&
    Number.isInteger(l.quantity) &&
    l.quantity > 0
  );
}

function loadCartLines(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isCartLine) : [];
  } catch {
    return [];
  }
}

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  preloadedState: {
    cart: { lines: loadCartLines(), drawerOpen: false },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

let savedLines = store.getState().cart.lines;
store.subscribe(() => {
  const { lines } = store.getState().cart;
  if (lines === savedLines) return;
  savedLines = lines;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  } catch {
    // Storage full or blocked: the cart still works for this visit.
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
