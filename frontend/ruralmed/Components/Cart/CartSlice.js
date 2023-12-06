import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    storeInfo:null
  },
  reducers: {

    addToCart: (state, action) => {
      
      const  product = action.payload;
     
      if (state.cartItems.length === 0 || state.storeInfo === product.storeId) {
        const existingItem = state.cartItems.find((item) => item.productID === product.productID);

        if (existingItem) {
          // If the item exists, remove it from the cart
          state.cartItems = state.cartItems.filter((item) => item.productID !== product.productID);
        } else {
          // If the item doesn't exist, add it to the cart
          state.cartItems.push({ ...product, quantity: 1 });
        }

        // Update storeInfo when adding to the cart
        state.storeInfo = product.storeId;
      } else {
        // Optionally, you can display an error message or clear the cart
        alert("You can only add items from the same store to the cart.");
        // Clear the cart (optional)
       // state.cartItems = [];
        //state.storeInfo = null;
      }
    },removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product.productID !== action.payload
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
