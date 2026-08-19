export type ProductCategory =
  | 'All'
  | 'Electronics'
  | 'Computers & Tech'
  | 'Fashion & Apparel'
  | 'Home & Kitchen'
  | 'Audio & Headphones'
  | 'Gaming & VR'
  | 'Health & Beauty'
  | 'Sports & Outdoors'
  | 'Books & Audible';

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Midnight Black / 256GB"
  priceDelta?: number;
  stock: number;
  attributes: Record<string, string>; // e.g. { Color: 'Midnight Black', Storage: '256GB' }
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isPrime: boolean;
  isBestSeller?: boolean;
  isLightningDeal?: boolean;
  lightningDealEnd?: string; // ISO string or time string
  stock: number;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  variants?: ProductVariant[];
  reviews: Review[];
  frequentlyBoughtTogetherIds?: string[];
  sellerName: string;
  sellerRating: number;
  returnPolicy: string;
  weightKg?: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  isGift?: boolean;
  giftMessage?: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface TrackingCheckpoint {
  status: OrderStatus;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface PaymentCard {
  id: string;
  cardHolder: string;
  lastFour: string;
  brand: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
  expiryMonth: string;
  expiryYear: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  shippingSpeed: 'Prime Free Next-Day' | 'Standard Delivery (2-3 Days)' | 'Same-Day Priority';
  paymentMethod: 'Credit Card' | 'PayPal' | 'Apple Pay' | 'Z-Pay Wallet' | 'Cash on Delivery';
  paymentCardLast4?: string;
  status: OrderStatus;
  placedAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
  carrier: string;
  driverName?: string;
  driverPhone?: string;
  driverVehicle?: string;
  currentCoordinates?: { lat: number; lng: number };
  checkpoints: TrackingCheckpoint[];
  couponUsed?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'customer' | 'seller' | 'admin';
  isPrimeMember: boolean;
  twoFactorEnabled: boolean;
  twoFactorType?: 'authenticator' | 'sms';
  phoneNumber?: string;
  addresses: ShippingAddress[];
  paymentCards: PaymentCard[];
  walletBalance: number;
  viewedProductIds: string[];
  searchHistory: string[];
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'order_status' | 'delivery' | 'flash_deal' | 'security' | 'system';
  timestamp: string;
  read: boolean;
  linkAction?: string;
  orderId?: string;
  productId?: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minSubtotal: number;
  description: string;
}

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'ar' | 'ja' | 'hi';
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'INR';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  rateAgainstUSD: number;
  name: string;
}
