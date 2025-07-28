import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { Order } from '@/types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (filters: any = {}) => {
    const response = await api.getOrders();
    return response;
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (id: string) => {
    const response = await api.getOrder(id);
    return response.data;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: {
    shipping_address_id: string;
    billing_address_id: string;
    payment_method: string;
    notes?: string;
  }) => {
    const response = await api.createOrder(orderData);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await api.updateOrderStatus(id, status);
    return response.data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      // Fetch Order
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload || null;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order';
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.orders.unshift(action.payload);
          state.currentOrder = action.payload;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.orders.findIndex(o => o.id === action.payload!.id);
          if (index >= 0) {
            state.orders[index] = action.payload;
          }
          if (state.currentOrder?.id === action.payload.id) {
            state.currentOrder = action.payload;
          }
        }
      });
  },
});

export const { clearError, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;