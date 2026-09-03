'use client';

import React from 'react';
import { CartItem, Order, UserProfile } from '@/types/ecommerce';
import { CreditCard, Wallet, Smartphone, Banknote, ShieldCheck, ArrowLeft } from 'lucide-react';

interface CheckoutPaymentStepProps {
  paymentMethod: Order['paymentMethod'];
  setPaymentMethod: (pm: Order['paymentMethod']) => void;
  user: UserProfile;
  cart: CartItem[];
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;
  formatPrice: (amount: number) => string;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const CheckoutPaymentStep: React.FC<CheckoutPaymentStepProps> = ({
  paymentMethod,
  setPaymentMethod,
  user,
  cart,
  cartSubtotal,
  cartDiscount,
  cartShipping,
  cartTax,
  cartTotal,
  formatPrice,
  isSubmitting,
  onBack,
  onNext,
}) => {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4">
      <h3 className="font-black text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <CreditCard size={16} className="text-amber-500" /> Select Payment Method
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Credit Card Option */}
        <label
          className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-colors ${
            paymentMethod === 'Credit Card'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
              : 'border-gray-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'Credit Card'}
                onChange={() => setPaymentMethod('Credit Card')}
                className="text-amber-500 focus:ring-0 accent-amber-500"
              />
              <span className="font-bold text-xs text-gray-900 dark:text-gray-100">Credit / Debit Card</span>
            </div>
            <CreditCard size={16} className="text-amber-500" />
          </div>
          <div className="text-[11px] text-gray-500 space-y-0.5">
            <div>
              Visa ending in <strong>4242</strong>
            </div>
            <div>Expires: 08/2029 (Alex Mercer)</div>
          </div>
        </label>

        {/* Z-Pay Wallet */}
        <label
          className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-colors ${
            paymentMethod === 'Z-Pay Wallet'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
              : 'border-gray-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'Z-Pay Wallet'}
                onChange={() => setPaymentMethod('Z-Pay Wallet')}
                className="text-amber-500 focus:ring-0 accent-amber-500"
              />
              <span className="font-bold text-xs text-gray-900 dark:text-gray-100">Z-Pay Store Balance</span>
            </div>
            <Wallet size={16} className="text-emerald-500" />
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            Available Balance: {formatPrice(user.walletBalance)}
          </div>
        </label>

        {/* Apple Pay */}
        <label
          className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
            paymentMethod === 'Apple Pay'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
              : 'border-gray-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'Apple Pay'}
              onChange={() => setPaymentMethod('Apple Pay')}
              className="text-amber-500 focus:ring-0 accent-amber-500"
            />
            <span className="font-bold text-xs text-gray-900 dark:text-gray-100">Apple Pay / Google Pay</span>
          </div>
          <Smartphone size={16} className="text-gray-500" />
        </label>

        {/* Cash on Delivery */}
        <label
          className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
            paymentMethod === 'Cash on Delivery'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
              : 'border-gray-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'Cash on Delivery'}
              onChange={() => setPaymentMethod('Cash on Delivery')}
              className="text-amber-500 focus:ring-0 accent-amber-500"
            />
            <span className="font-bold text-xs text-gray-900 dark:text-gray-100">Cash on Delivery</span>
          </div>
          <Banknote size={16} className="text-gray-500" />
        </label>
      </div>

      {/* Order Breakdown Summary Box */}
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 space-y-2 text-xs">
        <div className="font-bold text-gray-900 dark:text-gray-100">Order Summary</div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Items ({itemCount}):</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(cartSubtotal)}</span>
        </div>
        {cartDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Coupon Discount:</span>
            <span>-{formatPrice(cartDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Shipping & Handling:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}
          </span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Estimated Tax:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(cartTax)}</span>
        </div>
        <div className="flex justify-between text-sm font-black text-gray-900 dark:text-gray-100 pt-1.5 border-t border-gray-200 dark:border-slate-800">
          <span>Order Total:</span>
          <span className="text-amber-600 dark:text-amber-400">{formatPrice(cartTotal)}</span>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <ShieldCheck size={16} />
          <span>{user.twoFactorEnabled ? 'Proceed to 2FA Verification' : 'Authorize & Place Order'}</span>
        </button>
      </div>
    </div>
  );
};
