'use client';

import React, { createContext, useContext, useMemo } from 'react';
import {
  Product,
  CartItem,
  Order,
  UserProfile,
  PushNotification,
  Coupon,
  SupportedLanguage,
  SupportedCurrency,
  ProductCategory,
  ProductVariant,
  ShippingAddress,
  OrderStatus,
} from '@/types/ecommerce';
import { useAppState } from './useAppState';

interface AppContextType {
  // Catalog & Inventory
  products: Product[];
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeProductDetail: Product | null;
  setActiveProductDetail: (product: Product | null) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  addNewProduct: (productData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Cart & Saved
  cart: CartItem[];
  savedForLater: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  saveForLater: (productId: string, variantId?: string) => void;
  moveToCartFromSaved: (item: CartItem) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  toggleGiftStatus: (productId: string, isGift: boolean, message?: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Orders & Live Tracking
  orders: Order[];
  activeOrderForTracking: Order | null;
  setActiveOrderForTracking: (order: Order | null) => void;
  placeOrder: (
    shippingAddress: ShippingAddress,
    shippingSpeed: Order['shippingSpeed'],
    paymentMethod: Order['paymentMethod'],
    paymentCardLast4?: string
  ) => Promise<Order>;
  simulateAdvanceOrderStatus: (orderId: string) => void;
  updateOrderStatusByAdmin: (orderId: string, newStatus: OrderStatus) => void;

  // User & Auth
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  switchUserRole: (role: 'customer' | 'seller' | 'admin') => void;
  toggleTwoFactor: (enabled: boolean, type?: 'authenticator' | 'sms') => void;
  isTwoFactorModalOpen: boolean;
  openTwoFactorVerification: (callback: () => void) => void;
  closeTwoFactorModal: () => void;
  verify2FACode: (code: string) => boolean;

  // Notifications
  notifications: PushNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  triggerPushNotification: (
    title: string,
    message: string,
    type?: PushNotification['type'],
    orderId?: string,
    productId?: string
  ) => void;

  // UI Views & Modals
  viewMode: 'home' | 'catalog' | 'orders' | 'analytics' | 'seller';
  setViewMode: (mode: 'home' | 'catalog' | 'orders' | 'analytics' | 'seller') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isAdvisorOpen: boolean;
  setIsAdvisorOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Localization, Currency & Theme
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currency: SupportedCurrency;
  setCurrency: (curr: SupportedCurrency) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  isRTL: boolean;

  // Helpers
  t: (key: string, params?: Record<string, string | number>) => string;
  formatPrice: (amountInUSD: number) => string;
  playChimeSound: (type?: 'success' | 'alert' | 'notification') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const appState = useAppState();

  const contextValue = useMemo(() => appState, [appState]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
