import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartLine } from "../../types/product";

interface CartState {
  lines: CartLine[];
}

const initialState: CartState = {
  lines: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addLine(state, action: PayloadAction<CartLine>) {
      const existing = state.lines.find(
        (line) =>
          line.productId === action.payload.productId &&
          line.sizeId === action.payload.sizeId,
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.lines.push(action.payload);
      }
    },
    removeLine(
      state,
      action: PayloadAction<{ productId: string; sizeId: string }>,
    ) {
      state.lines = state.lines.filter(
        (line) =>
          !(
            line.productId === action.payload.productId &&
            line.sizeId === action.payload.sizeId
          ),
      );
    },
    setQuantity(
      state,
      action: PayloadAction<{
        productId: string;
        sizeId: string;
        quantity: number;
      }>,
    ) {
      const line = state.lines.find(
        (line) =>
          line.productId === action.payload.productId &&
          line.sizeId === action.payload.sizeId,
      );
      if (line) {
        line.quantity = Math.max(1, action.payload.quantity);
      }
    },
    clearCart(state) {
      state.lines = [];
    },
  },
});

export const { addLine, removeLine, setQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
