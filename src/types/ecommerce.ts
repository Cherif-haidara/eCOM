export type ProductCategory = 'Tous' | 'Mobilier' | 'Luminaires' | 'Céramique' | 'Maroquinerie' | 'Art de la Table';

export interface Vendor {
  id: string;
  name: string;
  city: string;
  rating: number;
  totalSales: number;
  badge: string;
  verified: boolean;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  userCity: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  stock: number;
  vendor: Vendor;
  description: string;
  details: string[];
  dimensions: string;
  materials: string;
  weight: string;
  finishes: { name: string; colorCode: string; inStock: boolean }[];
  image: string;
  secondaryImages: string[];
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  featured?: boolean;
  leadTime: string;
  sku: string;
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFinish: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  finish: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'payé' | 'en_preparation' | 'expedie' | 'livre';
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  promoCodeApplied?: string;
  paymentMethod: 'card' | 'apple_pay' | 'alma_3x' | 'bank_transfer';
  cardLast4?: string;
  trackingNumber: string;
  carrier: string;
}

export interface ConciergeRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  projectType: 'residentiel' | 'hotellerie' | 'professionnel';
  productInterest: string;
  dimensionsRequired: string;
  message: string;
  date: string;
}

export type ActiveRole = 'client' | 'vendeur' | 'architecte';
