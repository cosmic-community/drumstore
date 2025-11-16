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

// Contact form interface
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Category type
export type ProductCategory = 'drum-kits' | 'cymbals' | 'hardware' | 'sticks-mallets' | 'accessories';

// Rating type
export type Rating = '1' | '2' | '3' | '4' | '5';

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