import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { Product, ProductFilter, Category } from '@/types';

interface ProductState {
  products: Product[];
  categories: Category[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: ProductFilter;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchQuery: string;
}

const initialState: ProductState = {
  products: [],
  categories: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  searchQuery: '',
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilter = {}) => {
    const response = await api.getProducts(filters);
    return response;
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: string) => {
    const response = await api.getProduct(id);
    return response.data;
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const response = await api.getCategories();
    return response.data || [];
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: Partial<Product>) => {
    const response = await api.createProduct(productData);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: Partial<Product> }) => {
    const response = await api.updateProduct(id, data);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    await api.deleteProduct(id);
    return id;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
        sortBy: 'created_at',
        sortOrder: 'desc',
      };
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filters.search = action.payload;
      state.filters.page = 1; // Reset to first page on search
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Fetch Product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload || null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        if (action.payload) {
          state.products.unshift(action.payload);
        }
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.products.findIndex(p => p.id === action.payload!.id);
          if (index >= 0) {
            state.products[index] = action.payload;
          }
          if (state.currentProduct?.id === action.payload.id) {
            state.currentProduct = action.payload;
          }
        }
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setSearchQuery,
  setCurrentProduct,
} = productSlice.actions;

export default productSlice.reducer;