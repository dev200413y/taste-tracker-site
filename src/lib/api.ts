import { supabase } from '@/integrations/supabase/client';
import type { 
  Product, 
  Order, 
  CartItem, 
  Address, 
  Category,
  ProductFilter,
  ApiResponse,
  DashboardStats
} from '@/types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && {
            'Authorization': `Bearer ${session.access_token}`
          }),
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Product APIs
  async getProducts(filters: ProductFilter = {}): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return this.request<Product[]>(`/products?${params.toString()}`);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(product: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Category APIs
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories');
  }

  async createCategory(category: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  // Cart APIs
  async getCart(): Promise<ApiResponse<CartItem[]>> {
    return this.request<CartItem[]>('/cart');
  }

  async addToCart(productId: string, quantity: number): Promise<ApiResponse<CartItem>> {
    return this.request<CartItem>('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(id: string, quantity: number): Promise<ApiResponse<CartItem>> {
    return this.request<CartItem>(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/cart/${id}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<ApiResponse<void>> {
    return this.request<void>('/cart', {
      method: 'DELETE',
    });
  }

  // Order APIs
  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>('/orders');
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(orderData: {
    shipping_address_id: string;
    billing_address_id: string;
    payment_method: string;
    notes?: string;
  }): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Address APIs
  async getAddresses(): Promise<ApiResponse<Address[]>> {
    return this.request<Address[]>('/addresses');
  }

  async createAddress(address: Partial<Address>): Promise<ApiResponse<Address>> {
    return this.request<Address>('/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  }

  async updateAddress(id: string, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return this.request<Address>(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    });
  }

  async deleteAddress(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/addresses/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment APIs
  async initiatePayment(orderId: string, paymentMethod: string): Promise<ApiResponse<any>> {
    return this.request<any>('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, payment_method: paymentMethod }),
    });
  }

  async verifyPayment(transactionId: string): Promise<ApiResponse<any>> {
    return this.request<any>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ transaction_id: transactionId }),
    });
  }

  // Admin APIs
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>('/admin/dashboard');
  }

  async getAllOrders(filters: any = {}): Promise<ApiResponse<Order[]>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return this.request<Order[]>(`/admin/orders?${params.toString()}`);
  }

  // File Upload
  async uploadFile(file: File, folder: string = 'products'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(session?.access_token && {
          'Authorization': `Bearer ${session.access_token}`
        }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  }
}

export const api = new ApiClient();