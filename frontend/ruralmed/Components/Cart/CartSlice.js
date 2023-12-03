// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart: (state, action) => {
      state.cartItems.push({ ...action.payload, quantity: 1 });
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.productID !== action.payload
      );
    },
    updateCartItemQuantity: (state, action) => {
      const { productID, change } = action.payload;
      const item = state.cartItems.find((item) => item.productID === productID);
      if (item) {
        item.quantity = item.quantity + change;
      }
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity } =
  cartSlice.actions;

export default cartSlice.reducer;
