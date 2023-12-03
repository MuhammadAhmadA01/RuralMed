export const selectCartCount = (state) => {
  return state.cart.cartItems.reduce((count, item) => count + item.quantity, 0);
};
