import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  items: [],
  summary: {
    productTotal: 0,
    discountAmount: 0,
    deliveryCharge: 0,
    grandTotal: 0,
    itemCount: 0
  },
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/cart', { productId, quantity });
      dispatch(fetchCart());
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await api.put(`/cart/${cartId}`, { quantity });
      dispatch(fetchCart());
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/cart/${cartId}`);
      dispatch(fetchCart());
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.summary = initialState.summary;
    },
    addToCartLocal: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(i => i.productId === product.productId);
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.subtotal = existingItem.quantity * existingItem.discountedPrice;
      } else {
        state.items.push({
          cartId: Date.now(),
          productId: product.productId,
          productName: product.name,
          quantity: 1,
          discountedPrice: product.discountedPrice,
          discount: product.discount,
          imageUrl: product.imageUrl,
          subtotal: product.discountedPrice,
          maxStock: 10
        });
      }
      state.summary.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.summary.productTotal = state.items.reduce((sum, i) => sum + i.subtotal, 0);
      state.summary.grandTotal = state.summary.productTotal + state.summary.deliveryCharge;
    },
    updateQuantityLocal: (state, action) => {
      const { cartId, quantity } = action.payload;
      const item = state.items.find(i => i.cartId === cartId);
      if (item) {
        item.quantity = quantity;
        item.subtotal = item.quantity * item.discountedPrice;
      }
      state.summary.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.summary.productTotal = state.items.reduce((sum, i) => sum + i.subtotal, 0);
      state.summary.grandTotal = state.summary.productTotal + state.summary.deliveryCharge;
    },
    removeFromCartLocal: (state, action) => {
      state.items = state.items.filter(i => i.cartId !== action.payload);
      state.summary.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.summary.productTotal = state.items.reduce((sum, i) => sum + i.subtotal, 0);
      state.summary.grandTotal = state.summary.productTotal + state.summary.deliveryCharge;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.summary = {
          productTotal: action.payload.productTotal || 0,
          discountAmount: action.payload.discountAmount || 0,
          deliveryCharge: action.payload.deliveryCharge || 0,
          grandTotal: action.payload.grandTotal || 0,
          itemCount: action.payload.itemCount || 0
        };
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart, addToCartLocal, updateQuantityLocal, removeFromCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
