import { createSlice } from "@reduxjs/toolkit";
import { Alert } from "react-native";
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    storeInfo: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      if (state.cartItems.length === 0 || state.storeInfo === product.storeId) {
        if (!state.cartItems.length) {
          const existingItem = state.cartItems.find(
            (item) => item.productID === product.productID
          );

          if (existingItem) {
            // If the item exists, remove it from the cart
            state.cartItems = state.cartItems.filter(
              (item) => item.productID !== product.productID
            );
          } else {
            // If the item doesn't exist, add it to the cart
            if (!("quantity" in product)) {
              product["quantity"] = 1;

              state.cartItems.push(product);
            } else {
              state.cartItems.push(product);
            }
          }

          // Update storeInfo when adding to the cart
          state.storeInfo = product.storeId;
        } else {
          state.storeInfo = product.storeId;
          if (!("quantity" in product)) {
            product["quantity"] = 1;

            state.cartItems.push(product);
          } else {
            state.cartItems.push(product);
          }
        }
      } else {
        // Optionally, you can display an error message or clear the cart
        Alert.alert("You can only add items from the same store to the cart.");
        return;
        // Clear the cart (optional)
        // state.cartItems = [];
        //state.storeInfo = null;
      }
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
        console.log(item.quantity)
        item.quantity = item.quantity + change;
        if (item.quantity == item.availableQuantity) {
          console.log(item.availableQuantity)
          
          return;
        } 
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.storeInfo = null;
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
