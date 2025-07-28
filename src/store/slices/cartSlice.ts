import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  itemCount: 0,
};

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await api.getCart();
  return response.data || [];
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const response = await api.addToCart(productId, quantity);
    return response.data;
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }: { id: string; quantity: number }) => {
    const response = await api.updateCartItem(id, quantity);
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id: string) => {
    await api.removeFromCart(id);
    return id;
  }
);

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  await api.clearCart();
});

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { total, itemCount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Local cart operations for offline support
    addItemLocally: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product_id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: `temp-${Date.now()}`,
          user_id: '',
          product_id: product.id,
          quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          product,
        };
        state.items.push(newItem);
      }
      
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    },
    updateItemLocally: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
        
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
      }
    },
    removeItemLocally: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        if (action.payload) {
          const existingIndex = state.items.findIndex(
            item => item.product_id === action.payload!.product_id
          );
          
          if (existingIndex >= 0) {
            state.items[existingIndex] = action.payload;
          } else {
            state.items.push(action.payload);
          }
          
          const totals = calculateTotals(state.items);
          state.total = totals.total;
          state.itemCount = totals.itemCount;
        }
      })
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex(item => item.id === action.payload!.id);
          if (index >= 0) {
            state.items[index] = action.payload;
            const totals = calculateTotals(state.items);
            state.total = totals.total;
            state.itemCount = totals.itemCount;
          }
        }
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
      });
  },
});

export const { 
  clearError, 
  addItemLocally, 
  updateItemLocally, 
  removeItemLocally 
} = cartSlice.actions;

export default cartSlice.reducer;