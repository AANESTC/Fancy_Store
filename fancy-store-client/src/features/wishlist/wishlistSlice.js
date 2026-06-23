import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of product objects
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex(item => item.productId === product.productId);
      
      if (existingIndex >= 0) {
        // If it exists, remove it
        state.items.splice(existingIndex, 1);
      } else {
        // If it doesn't exist, add it
        state.items.push(product);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    }
  }
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
