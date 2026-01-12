// Database types matching Supabase schema
export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  review_count: number;
  category: string;
  isbn: string | null;
  description: string | null;
  image_url: string | null;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  book_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  book?: Book;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  account_type: 'reader' | 'student' | 'professional';
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery' | null;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  shipping_address: string | null;
  billing_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  book_id: string | null;
  title: string;
  author: string;
  price: number;
  quantity: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

// Legacy interface for compatibility
export interface User {
  id: string;
  name: string;
  email: string;
  accountType: 'reader' | 'student' | 'professional';
}
