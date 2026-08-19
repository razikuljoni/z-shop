'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import {
  INITIAL_PRODUCTS,
  INITIAL_USER,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COUPONS,
  CURRENCY_CONFIGS,
  TRANSLATIONS,
} from '@/data/mockData';

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
  // State Initialization with LocalStorage persistence if present
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-6']);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);
  const [activeOrderForTracking, setActiveOrderForTracking] = useState<Order | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Modals & Navigation
  const [viewMode, setViewMode] = useState<'home' | 'catalog' | 'orders' | 'analytics' | 'seller'>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // 2FA modal state
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [twoFactorCallback, setTwoFactorCallback] = useState<(() => void) | null>(null);

  // Localization & Theme
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const isRTL = language === 'ar';

  // Apply dark mode class to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      root.setAttribute('lang', language);
    }
  }, [theme, isRTL, language]);

  // Audio synthesizer chime for notifications & checkout
  const playChimeSound = useCallback((type: 'success' | 'alert' | 'notification' = 'notification') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      if (type === 'success') {
        // Double triumphant chord (E5, G#5, B5)
        const notes = [659.25, 830.61, 987.77];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.15, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.65);
        });
      } else if (type === 'alert') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        // Gentle modern notification ping (C6, G6)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(1046.5, now);
        osc2.frequency.setValueAtTime(1567.98, now + 0.09);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.1);
        osc2.start(now + 0.09);
        osc2.stop(now + 0.45);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Translation helper
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      let text = dict[key] || TRANSLATIONS.en[key] || key;
      if (params) {
        Object.entries(params).forEach(([pKey, pVal]) => {
          text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
        });
      }
      return text;
    },
    [language]
  );

  // Currency Formatter
  const formatPrice = useCallback(
    (amountInUSD: number): string => {
      const cfg = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
      const converted = amountInUSD * cfg.rateAgainstUSD;
      if (cfg.code === 'JPY') {
        return `${cfg.symbol}${Math.round(converted).toLocaleString()}`;
      }
      return `${cfg.symbol}${converted.toFixed(2)}`;
    },
    [currency]
  );

  // Push Notification trigger
  const triggerPushNotification = useCallback(
    (
      title: string,
      message: string,
      type: PushNotification['type'] = 'system',
      orderId?: string,
      productId?: string
    ) => {
      const newNotif: PushNotification = {
        id: `notif-${Date.now()}`,
        title,
        message,
        type,
        timestamp: 'Just now',
        read: false,
        orderId,
        productId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      playChimeSound(type === 'delivery' ? 'success' : 'notification');
    },
    [playChimeSound]
  );

  // Cart Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const itemPrice = item.product.price + (item.selectedVariant?.priceDelta || 0);
    return sum + itemPrice * item.quantity;
  }, 0);

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minSubtotal) {
    if (appliedCoupon.discountPercent) {
      cartDiscount = (cartSubtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount) {
      cartDiscount = Math.min(appliedCoupon.discountAmount, cartSubtotal);
    }
  }

  // Free shipping over $35 or for Prime users
  const cartShipping = user.isPrimeMember || cartSubtotal >= 35 || cartSubtotal === 0 ? 0 : 9.99;
  const cartTax = cartSubtotal > 0 ? (cartSubtotal - cartDiscount) * 0.0825 : 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping + cartTax);

  // Cart Operations
  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    // Check inventory
    const currentStock = variant ? variant.stock : product.stock;
    if (currentStock <= 0) {
      triggerPushNotification('⚠️ Out of Stock', `${product.title} is currently out of stock.`, 'system');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, currentStock),
        };
        return updated;
      }

      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant?.id,
          product,
          quantity: Math.min(quantity, currentStock),
          selectedVariant: variant,
          isGift: false,
        },
      ];
    });

    // Add to user browsing history
    setUser((prev) => ({
      ...prev,
      viewedProductIds: Array.from(new Set([product.id, ...prev.viewedProductIds])),
    }));

    triggerPushNotification(
      '🛒 Added to Cart',
      `${product.title} (${quantity}x) has been added to your Z Shop cart.`,
      'system',
      undefined,
      product.id
    );
  };

  const updateCartQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.variantId === variantId) {
          const maxStock = item.selectedVariant ? item.selectedVariant.stock : item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variantId === variantId)));
  };

  const saveForLater = (productId: string, variantId?: string) => {
    const itemToSave = cart.find((item) => item.productId === productId && item.variantId === variantId);
    if (!itemToSave) return;
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variantId === variantId)));
    setSavedForLater((prev) => [...prev, itemToSave]);
    triggerPushNotification('📌 Saved for Later', `${itemToSave.product.title} moved to your saved list.`, 'system');
  };

  const moveToCartFromSaved = (item: CartItem) => {
    setSavedForLater((prev) =>
      prev.filter((i) => !(i.productId === item.productId && i.variantId === item.variantId))
    );
    addToCart(item.product, item.selectedVariant, item.quantity);
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleGiftStatus = (productId: string, isGift: boolean, message?: string) => {
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, isGift, giftMessage: message } : item))
    );
  };

  const applyCoupon = (code: string) => {
    const found = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { success: false, message: 'Invalid promo code. Try ZSHOP20 or PRIME50' };
    }
    if (cartSubtotal < found.minSubtotal) {
      return {
        success: false,
        message: `Order must be at least ${formatPrice(found.minSubtotal)} to apply code ${found.code}`,
      };
    }
    setAppliedCoupon(found);
    triggerPushNotification('🏷️ Coupon Applied!', `${found.code}: ${found.description}`, 'system');
    return { success: true, message: `Promo code ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        return prev.filter((id) => id !== productId);
      }
      triggerPushNotification('❤️ Wishlist Updated', 'Item added to your Saved Wishlist', 'system', undefined, productId);
      return [...prev, productId];
    });
  };

  // Inventory & Stock Management (Real-time updates)
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, stock: Math.max(0, newStock) };
        }
        return p;
      })
    );
    triggerPushNotification('📦 Stock Updated', `Inventory level updated to ${newStock} units.`, 'system');
  };

  const addNewProduct = (productData: Partial<Product>) => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: productData.title || 'New Product',
      brand: productData.brand || 'Z Shop Brand',
      category: productData.category || 'Electronics',
      price: productData.price || 49.99,
      originalPrice: productData.originalPrice || (productData.price ? productData.price * 1.25 : 69.99),
      rating: 5.0,
      reviewCount: 1,
      isPrime: productData.isPrime ?? true,
      stock: productData.stock || 20,
      images: productData.images?.length
        ? productData.images
        : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=900&auto=format&fit=crop&q=80'],
      description: productData.description || 'Quality product available exclusively on Z Shop.',
      features: productData.features || ['Premium quality build', 'Fast Prime 1-day delivery', 'Full warranty'],
      specifications: productData.specifications || { Warranty: '1-Year', Condition: 'Brand New' },
      reviews: [],
      sellerName: user.name || 'Verified Z-Seller',
      sellerRating: 5.0,
      returnPolicy: '30-Day Returns',
    };
    setProducts((prev) => [newProduct, ...prev]);
    triggerPushNotification('✨ Product Listed', `Successfully published "${newProduct.title}" to catalog.`, 'system');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    triggerPushNotification('🗑️ Product Removed', 'Product removed from store catalog.', 'system');
  };

  // 2FA Security Handler
  const openTwoFactorVerification = (callback: () => void) => {
    setTwoFactorCallback(() => callback);
    setIsTwoFactorModalOpen(true);
  };

  const closeTwoFactorModal = () => {
    setIsTwoFactorModalOpen(false);
    setTwoFactorCallback(null);
  };

  const verify2FACode = (code: string): boolean => {
    // Accepts any valid 6-digit code or demo default '123456'
    if (code.trim().length === 6 && /^\d+$/.test(code.trim())) {
      if (twoFactorCallback) {
        twoFactorCallback();
      }
      closeTwoFactorModal();
      triggerPushNotification('🛡️ 2FA Verified', 'Two-Factor Authentication passed successfully.', 'security');
      return true;
    }
    return false;
  };

  // Place Order with Real-Time Stock Decrement & Live Tracking Dispatch
  const placeOrder = async (
    shippingAddress: ShippingAddress,
    shippingSpeed: Order['shippingSpeed'],
    paymentMethod: Order['paymentMethod'],
    paymentCardLast4: string = '4242'
  ): Promise<Order> => {
    // 1. Decrement product stock in real time
    setProducts((prev) =>
      prev.map((prod) => {
        const inCart = cart.filter((item) => item.productId === prod.id);
        if (inCart.length === 0) return prod;
        const totalPurchased = inCart.reduce((sum, item) => sum + item.quantity, 0);
        return {
          ...prod,
          stock: Math.max(0, prod.stock - totalPurchased),
        };
      })
    );

    // 2. Create the order
    const orderId = `ZS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: orderId,
      userId: user.id,
      userName: user.name,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingCost: cartShipping,
      tax: cartTax,
      total: cartTotal,
      shippingAddress,
      shippingSpeed,
      paymentMethod,
      paymentCardLast4,
      status: 'Order Placed',
      placedAt: new Date().toISOString(),
      estimatedDelivery:
        shippingSpeed === 'Prime Free Next-Day'
          ? 'Tomorrow by 8:00 PM'
          : shippingSpeed === 'Same-Day Priority'
          ? 'Today by 9:00 PM'
          : 'In 2-3 Business Days',
      trackingNumber: `1Z${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
      carrier: 'Z-Express Logistics',
      driverName: 'Dave Kowalski',
      driverPhone: '+1 (555) 890-1122',
      driverVehicle: 'Electric Delivery Van #402',
      currentCoordinates: { lat: 47.608013, lng: -122.335167 },
      checkpoints: [
        {
          status: 'Order Placed',
          location: `${shippingAddress.city}, ${shippingAddress.state}`,
          timestamp: 'Just now',
          description: 'Payment authorized and order confirmed',
          completed: true,
        },
        {
          status: 'Processing',
          location: 'Z-Fulfillment Center #WA-8',
          timestamp: 'Pending',
          description: 'Items allocated and dispatched to automated packing bay',
          completed: false,
        },
        {
          status: 'Shipped',
          location: 'Regional Sorting Facility',
          timestamp: 'Pending',
          description: 'Package in transit with Z-Express courier network',
          completed: false,
        },
        {
          status: 'Out for Delivery',
          location: 'Local Delivery Hub',
          timestamp: 'Pending',
          description: 'Package loaded on delivery vehicle for final drop-off',
          completed: false,
        },
        {
          status: 'Delivered',
          location: `${shippingAddress.addressLine1}`,
          timestamp: 'Estimated soon',
          description: 'Delivered directly to front door or mailroom',
          completed: false,
        },
      ],
      couponUsed: appliedCoupon?.code,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveOrderForTracking(newOrder);

    // Trigger celebratory push notification
    triggerPushNotification(
      '🎉 Order Confirmed!',
      `Order #${orderId} for ${formatPrice(newOrder.total)} has been placed. Tracking is now live!`,
      'order_status',
      orderId
    );

    return newOrder;
  };

  // Advance delivery status simulation
  const simulateAdvanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const statusFlow: OrderStatus[] = [
          'Order Placed',
          'Processing',
          'Shipped',
          'Out for Delivery',
          'Delivered',
        ];
        const currentIndex = statusFlow.indexOf(order.status);
        if (currentIndex >= statusFlow.length - 1) return order;

        const nextStatus = statusFlow[currentIndex + 1];

        const updatedCheckpoints = order.checkpoints.map((cp, idx) => {
          if (idx <= currentIndex + 1) {
            return {
              ...cp,
              completed: true,
              timestamp: cp.timestamp === 'Pending' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : cp.timestamp,
            };
          }
          return cp;
        });

        triggerPushNotification(
          `🚚 Delivery Update: ${nextStatus}`,
          `Order #${order.id} status changed to "${nextStatus}".`,
          'delivery',
          order.id
        );

        const updatedOrder = {
          ...order,
          status: nextStatus,
          checkpoints: updatedCheckpoints,
        };

        if (activeOrderForTracking?.id === orderId) {
          setActiveOrderForTracking(updatedOrder);
        }

        return updatedOrder;
      })
    );
  };

  const updateOrderStatusByAdmin = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return { ...order, status: newStatus };
      })
    );
    triggerPushNotification(
      '📋 Order Status Updated',
      `Order #${orderId} was updated to "${newStatus}" by Seller.`,
      'order_status',
      orderId
    );
  };

  // User Profile switch
  const switchUserRole = (role: 'customer' | 'seller' | 'admin') => {
    setUser((prev) => ({
      ...prev,
      role,
      name: role === 'seller' ? 'Sarah Jenkins (Apex Store)' : role === 'admin' ? 'Admin Operator' : 'Alex Mercer',
    }));
    triggerPushNotification(
      '👤 Role Switched',
      `Switched workspace view to ${role.toUpperCase()} profile.`,
      'system'
    );
  };

  const toggleTwoFactor = (enabled: boolean, type: 'authenticator' | 'sms' = 'authenticator') => {
    setUser((prev) => ({
      ...prev,
      twoFactorEnabled: enabled,
      twoFactorType: type,
    }));
    triggerPushNotification(
      enabled ? '🔒 2FA Enabled' : '🔓 2FA Disabled',
      enabled ? `Two-Factor Authentication is now active via ${type.toUpperCase()}.` : '2FA has been disabled.',
      'security'
    );
  };

  // Notification methods
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeProductDetail,
        setActiveProductDetail,
        updateProductStock,
        addNewProduct,
        deleteProduct,

        cart,
        savedForLater,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTax,
        cartTotal,
        appliedCoupon,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        saveForLater,
        moveToCartFromSaved,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleGiftStatus,

        wishlist,
        toggleWishlist,

        orders,
        activeOrderForTracking,
        setActiveOrderForTracking,
        placeOrder,
        simulateAdvanceOrderStatus,
        updateOrderStatusByAdmin,

        user,
        setUser,
        switchUserRole,
        toggleTwoFactor,
        isTwoFactorModalOpen,
        openTwoFactorVerification,
        closeTwoFactorModal,
        verify2FACode,

        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        triggerPushNotification,

        viewMode,
        setViewMode,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthOpen,
        setIsAuthOpen,
        isAdvisorOpen,
        setIsAdvisorOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,

        language,
        setLanguage,
        currency,
        setCurrency,
        theme,
        setTheme,
        toggleTheme,
        isRTL,

        t,
        formatPrice,
        playChimeSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
