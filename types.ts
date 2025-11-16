// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
  thumbnail?: string;
}

// Product interface
export interface Product extends CosmicObject {
  type: 'products';
  metadata: {
    product_name: string;
    description?: string;
    price: number;
    sku?: string;
    product_images?: Array<{
      url: string;
      imgix_url: string;
    }>;
    category?: {
      key: string;
      value: string;
    };
    brand?: string;
    in_stock: boolean;
    collections?: Collection[];
    specifications?: Record<string, any>;
  };
}

// Collection interface
export interface Collection extends CosmicObject {
  type: 'collections';
  metadata: {
    collection_name: string;
    description?: string;
    collection_image?: {
      url: string;
      imgix_url: string;
    };
    featured?: boolean;
  };
}

// Review interface
export interface Review extends CosmicObject {
  type: 'reviews';
  metadata: {
    product: Product;
    reviewer_name: string;
    rating: {
      key: string;
      value: string;
    };
    review_text?: string;
    verified_purchase?: boolean;
    review_date?: string;
  };
}

// Order interface
export interface Order extends CosmicObject {
  type: 'orders';
  metadata: {
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    shipping_address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    billing_address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    order_items: Array<{
      product_id: string;
      product_name: string;
      product_image?: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    total: number;
    order_status: {
      key: string;
      value: string;
    };
    payment_status: {
      key: string;
      value: string;
    };
    stripe_payment_intent_id?: string;
    stripe_session_id?: string;
    order_date: string;
    notes?: string;
  };
}

// Cart item interface
export interface CartItem {
  product: Product;
  quantity: number;
}

// Cart state interface
export interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

// Checkout session data
export interface CheckoutSessionData {
  items: Array<{
    product_id: string;
    product_name: string;
    product_image?: string;
    quantity: number;
    price: number;
  }>;
  customer_email: string;
  customer_name: string;
  shipping_address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

// Category type
export type ProductCategory = 'drum-kits' | 'cymbals' | 'hardware' | 'sticks-mallets' | 'accessories';

// Rating type
export type Rating = '1' | '2' | '3' | '4' | '5';

// Order status type
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Payment status type
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
}

// Type guards
export function isProduct(obj: CosmicObject): obj is Product {
  return obj.type === 'products';
}

export function isCollection(obj: CosmicObject): obj is Collection {
  return obj.type === 'collections';
}

export function isReview(obj: CosmicObject): obj is Review {
  return obj.type === 'reviews';
}

export function isOrder(obj: CosmicObject): obj is Order {
  return obj.type === 'orders';
}