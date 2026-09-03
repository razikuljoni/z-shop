'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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

export const useAppState = () => {
  // State Initialization
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

  const playChimeSound = useCallback((type: 'success' | 'alert' | 'notification' = 'notification') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      if (type === 'success') {
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

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

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

  const cartShipping = user.isPrimeMember || cartSubtotal >= 35 || cartSubtotal === 0 ? 0 : 9.99;
  const cartTax = cartSubtotal > 0 ? (cartSubtotal - cartDiscount) * 0.0825 : 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping + cartTax);

  const addToCart = useCallback((product: Product, variant?: ProductVariant, quantity: number = 1) => {
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
  }, [triggerPushNotification]);

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variantId === variantId)));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
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
  }, [removeFromCart]);

  const saveForLater = useCallback((productId: string, variantId?: string) => {
    const itemToSave = cart.find((item) => item.productId === productId && item.variantId === variantId);
    if (!itemToSave) return;
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variantId === variantId)));
    setSavedForLater((prev) => [...prev, itemToSave]);
    triggerPushNotification('📌 Saved for Later', `${itemToSave.product.title} moved to your saved list.`, 'system');
  }, [cart, triggerPushNotification]);

  const moveToCartFromSaved = useCallback((item: CartItem) => {
    setSavedForLater((prev) =>
      prev.filter((i) => !(i.productId === item.productId && i.variantId === item.variantId))
    );
    addToCart(item.product, item.selectedVariant, item.quantity);
  }, [addToCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
  }, []);

  const toggleGiftStatus = useCallback((productId: string, isGift: boolean, message?: string) => {
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, isGift, giftMessage: message } : item))
    );
  }, []);

  const applyCoupon = useCallback((code: string) => {
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
  }, [cartSubtotal, formatPrice, triggerPushNotification]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    const exists = wishlist.includes(productId);
    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
    } else {
      setWishlist((prev) => [...prev, productId]);
      triggerPushNotification('❤️ Wishlist Updated', 'Item added to your Saved Wishlist', 'system', undefined, productId);
    }
  }, [wishlist, triggerPushNotification]);

  const updateProductStock = useCallback((productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, stock: Math.max(0, newStock) };
        }
        return p;
      })
    );
    triggerPushNotification('📦 Stock Updated', `Inventory level updated to ${newStock} units.`, 'system');
  }, [triggerPushNotification]);

  const addNewProduct = useCallback((productData: Partial<Product>) => {
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
  }, [user.name, triggerPushNotification]);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    triggerPushNotification('🗑️ Product Removed', 'Product removed from store catalog.', 'system');
  }, [triggerPushNotification]);

  const openTwoFactorVerification = useCallback((callback: () => void) => {
    setTwoFactorCallback(() => callback);
    setIsTwoFactorModalOpen(true);
  }, []);

  const closeTwoFactorModal = useCallback(() => {
    setIsTwoFactorModalOpen(false);
    setTwoFactorCallback(null);
  }, []);

  const verify2FACode = useCallback((code: string): boolean => {
    if (code.trim().length === 6 && /^\d+$/.test(code.trim())) {
      if (twoFactorCallback) {
        twoFactorCallback();
      }
      closeTwoFactorModal();
      triggerPushNotification('🛡️ 2FA Verified', 'Two-Factor Authentication passed successfully.', 'security');
      return true;
    }
    return false;
  }, [twoFactorCallback, closeTwoFactorModal, triggerPushNotification]);

  const placeOrder = useCallback(async (
    shippingAddress: ShippingAddress,
    shippingSpeed: Order['shippingSpeed'],
    paymentMethod: Order['paymentMethod'],
    paymentCardLast4: string = '4242'
  ): Promise<Order> => {
    const newOrderId = `ZORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const deliveryEstimate =
      shippingSpeed === 'Same-Day Priority'
        ? 'Today by 9:00 PM'
        : shippingSpeed === 'Prime Free Next-Day'
        ? 'Tomorrow by 2:00 PM'
        : 'In 3-5 Business Days';

    const createdOrder: Order = {
      id: newOrderId,
      userId: user.id,
      userName: user.name,
      placedAt: 'Just now',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingCost: cartShipping,
      tax: cartTax,
      total: cartTotal,
      status: 'Order Placed',
      shippingAddress,
      shippingSpeed,
      paymentMethod,
      paymentCardLast4,
      trackingNumber: `ZTRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      carrier: 'Z-Express Logistics',
      estimatedDelivery: deliveryEstimate,
      checkpoints: [
        {
          status: 'Order Placed',
          location: 'Merchant Fulfillment Hub',
          timestamp: 'Just now',
          description: 'Order received and payment confirmed.',
          completed: true,
        },
      ],
    };

    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((i) => i.productId === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      })
    );

    setOrders((prev) => [createdOrder, ...prev]);
    clearCart();
    setActiveOrderForTracking(createdOrder);

    triggerPushNotification(
      '🎉 Order Placed Successfully!',
      `Order #${createdOrder.id} is confirmed. Est. Delivery: ${deliveryEstimate}`,
      'order_status',
      createdOrder.id
    );

    playChimeSound('success');
    return createdOrder;
  }, [cart, cartSubtotal, cartDiscount, cartShipping, cartTax, cartTotal, clearCart, triggerPushNotification, playChimeSound, user]);

  const simulateAdvanceOrderStatus = useCallback((orderId: string) => {
    const nextStatusMap: Record<OrderStatus, OrderStatus> = {
      'Order Placed': 'Processing',
      'Processing': 'Shipped',
      'Shipped': 'Out for Delivery',
      'Out for Delivery': 'Delivered',
      'Delivered': 'Delivered',
      'Cancelled': 'Cancelled',
    };

    let targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;
    const nextStatus = nextStatusMap[targetOrder.status];

    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order))
    );

    triggerPushNotification(
      `📦 Order Status: ${nextStatus}`,
      `Order #${orderId} update: Package status is now "${nextStatus}".`,
      nextStatus === 'Delivered' ? 'delivery' : 'order_status',
      orderId
    );
  }, [orders, triggerPushNotification]);

  const updateOrderStatusByAdmin = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    triggerPushNotification(
      `⚙️ Admin Order Update: ${newStatus}`,
      `Merchant manually updated Order #${orderId} to ${newStatus}`,
      'system',
      orderId
    );
  }, [triggerPushNotification]);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const switchUserRole = useCallback((role: 'customer' | 'seller' | 'admin') => {
    setUser((prev) => ({ ...prev, role }));
    triggerPushNotification('👤 Role Switched', `Switched workspace view to ${role.toUpperCase()} mode`, 'system');
  }, [triggerPushNotification]);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return {
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
  };
};

function toggleTwoFactor(enabled: boolean, type: "authenticator" | "sms" = "authenticator") {
  // Stub for hook export compatibility
}
