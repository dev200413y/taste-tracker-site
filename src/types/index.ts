// Core type definitions for the e-commerce platform
export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  role: 'customer' | 'admin' | 'super-admin';
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku: string;
  barcode?: string;
  stock_quantity: number;
  min_stock_level: number;
  category_id: string;
  brand?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: ProductImage[];
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  rating_average: number;
  rating_count: number;
  seller_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  payment_method: PaymentMethod;
  shipping_address: Address;
  billing_address: Address;
  notes?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  payments: Payment[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  product?: Product;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  gateway: PaymentGateway;
  transaction_id?: string;
  gateway_response?: any;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type FulfillmentStatus = 
  | 'unfulfilled'
  | 'partial'
  | 'fulfilled';

export type PaymentMethod = 
  | 'cod'
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'wallet';

export type PaymentGateway = 
  | 'phonepe'
  | 'razorpay'
  | 'stripe'
  | 'manual';

export interface ProductFilter {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
  topProducts: Array<{
    product: Product;
    sales: number;
    revenue: number;
  }>;
  salesChart: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
}