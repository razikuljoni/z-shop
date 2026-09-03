'use client';

import React from 'react';
import { Order, UserProfile } from '@/types/ecommerce';
import { CheckCircle2, Truck } from 'lucide-react';

interface CheckoutSuccessStepProps {
  user: UserProfile;
  createdOrder: Order;
  formatPrice: (amount: number) => string;
  onClose: () => void;
  onTrack: (order: Order) => void;
}

export const CheckoutSuccessStep: React.FC<CheckoutSuccessStepProps> = ({
  user,
  createdOrder,
  formatPrice,
  onClose,
  onTrack,
}) => {
  return (
    <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
        <CheckCircle2 size={36} />
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
          Order Successfully Placed
        </span>
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-2">
          Thank you for your order, {user.name.split(' ')[0]}!
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          We sent a confirmation email to <strong>{user.email}</strong> with order receipt details.
        </p>
      </div>

      {/* Order Card Receipt */}
      <div className="max-w-md mx-auto p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 text-left text-xs space-y-2">
        <div className="flex justify-between border-b border-gray-200 dark:border-slate-800 pb-2">
          <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
          <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{createdOrder.id}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 dark:border-slate-800 pb-2">
          <span className="text-gray-600 dark:text-gray-400">Estimated Delivery:</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">{createdOrder.estimatedDelivery}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 dark:border-slate-800 pb-2">
          <span className="text-gray-600 dark:text-gray-400">Ship To:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {createdOrder.shippingAddress.addressLine1}, {createdOrder.shippingAddress.city}
          </span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="font-bold text-gray-700 dark:text-gray-300">Total Charged:</span>
          <span className="font-black text-sm text-gray-900 dark:text-gray-100">{formatPrice(createdOrder.total)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          id="live-track-order-btn"
          onClick={() => {
            onClose();
            onTrack(createdOrder);
          }}
          className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Truck size={16} />
          <span>Live Track Package</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold text-xs transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
