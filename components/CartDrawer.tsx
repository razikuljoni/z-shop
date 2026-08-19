'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Trash2,
  Bookmark,
  Truck,
  ArrowRight,
  Gift,
  Tag,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react';
import Image from 'next/image';

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
    clearCart,
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 dark:border-slate-800 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gray-50/80 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-amber-500" />
            <h2 className="text-base font-black text-gray-900 dark:text-gray-100">
              Your Z Shop Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
          </div>

          <button
            id="close-cart-drawer-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
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
                <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
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
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                {t('empty_cart')}
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Your shopping cart is waiting. Explore our electronics, audio, and gaming deals.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                {t('continue_shopping')}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const itemPrice = item.product.price + (item.selectedVariant?.priceDelta || 0);
                return (
                  <div
                    key={`${item.productId}-${item.variantId || 'base'}`}
                    className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-850 border border-gray-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex gap-3">
                      {/* Product Thumbnail */}
                      <div className="relative w-16 h-16 bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.title}
                          fill
                          className="object-contain p-1"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold uppercase text-gray-400">{item.product.brand}</div>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate">
                          {item.product.title}
                        </h4>
                        {item.selectedVariant && (
                          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                            Option: {item.selectedVariant.name}
                          </div>
                        )}
                        <div className="font-black text-sm text-gray-900 dark:text-gray-100 mt-1">
                          {formatPrice(itemPrice)}
                        </div>
                      </div>
                    </div>

                    {/* Quantity and Actions Bar */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200/60 dark:border-slate-800">
                      {/* Qty Controls */}
                      <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="px-2 py-0.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-bold text-gray-900 dark:text-gray-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="px-2 py-0.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                          +
                        </button>
                      </div>

                      {/* Secondary Actions */}
                      <div className="flex items-center gap-3 text-[11px]">
                        <button
                          onClick={() => saveForLater(item.productId, item.variantId)}
                          className="text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 font-medium"
                        >
                          <Bookmark size={13} /> Save for later
                        </button>

                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Gift Option Checkbox */}
                    <label className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-400 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={item.isGift || false}
                        onChange={(e) => toggleGiftStatus(item.productId, e.target.checked)}
                        className="w-3 h-3 text-amber-500 rounded focus:ring-0 accent-amber-500"
                      />
                      <span className="flex items-center gap-1">
                        <Gift size={12} className="text-amber-500" /> This order contains a gift
                      </span>
                    </label>
                  </div>
                );
              })}
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
                  <button onClick={removeCoupon} className="font-bold text-red-500 hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
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
          {savedForLater.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                {t('saved_for_later')} ({savedForLater.length})
              </h3>
              <div className="space-y-2">
                {savedForLater.map((sItem) => (
                  <div
                    key={`${sItem.productId}-${sItem.variantId || 'base'}`}
                    className="p-2.5 rounded-lg bg-gray-50 dark:bg-slate-850 border border-gray-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative w-10 h-10 bg-white dark:bg-slate-800 rounded p-1 shrink-0">
                        <Image src={sItem.product.images[0]} alt="" fill className="object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-gray-900 dark:text-gray-100 truncate">{sItem.product.title}</div>
                        <div className="text-gray-500">{formatPrice(sItem.product.price)}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => moveToCartFromSaved(sItem)}
                      className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs shrink-0"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Calculation */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-slate-800 bg-gray-50/90 dark:bg-slate-850 space-y-3">
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
                  {cartShipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(cartShipping)}
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
              id="proceed-to-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
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
