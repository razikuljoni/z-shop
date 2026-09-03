'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Truck, ArrowRight, Tag, ShieldCheck, ShoppingCart } from 'lucide-react';
import { CartItemRow } from './cart/CartItemRow';
import { SavedForLaterSection } from './cart/SavedForLaterSection';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    savedForLater,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    appliedCoupon,
    updateCartQuantity,
    removeFromCart,
    saveForLater,
    moveToCartFromSaved,
    applyCoupon,
    removeCoupon,
    toggleGiftStatus,
    setIsCheckoutOpen,
    formatPrice,
    user,
    t,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 35;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const totalQuantity = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 dark:border-slate-800 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gray-100 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-amber-500" />
            <h2 className="text-base font-black text-gray-900 dark:text-gray-100">
              Your Z Shop Cart ({totalQuantity})
            </h2>
          </div>

          <button
            type="button"
            id="close-cart-drawer-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Shopping Cart"
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="px-5 py-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/40 text-xs">
          {user.isPrimeMember ? (
            <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold">
              <Truck size={15} />
              <span>You get FREE Prime 1-Day Shipping on all items!</span>
            </div>
          ) : cartSubtotal >= freeShippingThreshold ? (
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
              <Truck size={15} />
              <span>🎉 Congratulations! Your order qualifies for FREE Delivery.</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-gray-800 dark:text-gray-200">
                <span>Add {formatPrice(amountNeeded)} more for FREE Shipping</span>
                <span className="font-bold text-amber-600">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart size={28} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{t('empty_cart')}</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Your shopping cart is waiting. Explore our electronics, audio, and gaming deals.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                {t('continue_shopping')}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <CartItemRow
                  key={`${item.productId}-${item.variantId || 'base'}`}
                  item={item}
                  formatPrice={formatPrice}
                  updateCartQuantity={updateCartQuantity}
                  saveForLater={saveForLater}
                  removeFromCart={removeFromCart}
                  toggleGiftStatus={toggleGiftStatus}
                />
              ))}
            </div>
          )}

          {/* Promo Code Input Section */}
          {cart.length > 0 && (
            <div className="pt-2">
              {appliedCoupon ? (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <Tag size={14} className="text-emerald-600" />
                    <div>
                      <span className="font-bold">{appliedCoupon.code}:</span> {appliedCoupon.description}
                    </div>
                  </div>
                  <button type="button" onClick={removeCoupon} className="font-bold text-red-500 hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    aria-label="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code (try ZSHOP20)"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-gray-100 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-gray-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-500 font-medium mt-1">{couponError}</p>}
            </div>
          )}

          {/* Saved for Later section */}
          <SavedForLaterSection
            savedForLater={savedForLater}
            formatPrice={formatPrice}
            moveToCartFromSaved={moveToCartFromSaved}
            title={t('saved_for_later')}
          />
        </div>

        {/* Footer Checkout Calculation */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(cartSubtotal)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount Savings</span>
                  <span>-{formatPrice(cartDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {cartShipping === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(cartShipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Estimated Tax</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(cartTax)}</span>
              </div>

              <div className="flex justify-between text-base font-black text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-200 dark:border-slate-800">
                <span>Order Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              id="proceed-to-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('proceed_to_checkout')}</span>
              <ArrowRight size={18} />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Encrypted SSL 256-bit Secure Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
