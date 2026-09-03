'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface CheckoutStepperProps {
  step: string;
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ step }) => {
  if (step === 'success') return null;

  return (
    <div className="px-6 py-3 bg-amber-50/70 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
            step === 'address'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          1
        </span>
        <span
          className={
            step === 'address'
              ? 'font-bold text-gray-900 dark:text-gray-100'
              : 'text-gray-500 dark:text-gray-400'
          }
        >
          Shipping Address
        </span>
      </div>
      <ChevronRight size={14} className="text-gray-400" />

      <div className="flex items-center gap-2">
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
            step === 'shipping'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-gray-200 dark:bg-slate-700 text-gray-600'
          }`}
        >
          2
        </span>
        <span
          className={
            step === 'shipping'
              ? 'font-bold text-gray-900 dark:text-gray-100'
              : 'text-gray-400'
          }
        >
          Delivery Options
        </span>
      </div>
      <ChevronRight size={14} className="text-gray-400" />

      <div className="flex items-center gap-2">
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
            step === 'payment' || step === '2fa'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-gray-200 dark:bg-slate-700 text-gray-600'
          }`}
        >
          3
        </span>
        <span
          className={
            step === 'payment' || step === '2fa'
              ? 'font-bold text-gray-900 dark:text-gray-100'
              : 'text-gray-400'
          }
        >
          Payment & 2FA
        </span>
      </div>
    </div>
  );
};
