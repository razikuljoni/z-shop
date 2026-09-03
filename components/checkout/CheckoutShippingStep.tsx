'use client';

import React from 'react';
import { Order } from '@/types/ecommerce';
import { Truck, ArrowLeft, ChevronRight } from 'lucide-react';

interface CheckoutShippingStepProps {
  shippingSpeed: Order['shippingSpeed'];
  setShippingSpeed: (speed: Order['shippingSpeed']) => void;
  onBack: () => void;
  onNext: () => void;
}

export const CheckoutShippingStep: React.FC<CheckoutShippingStepProps> = ({
  shippingSpeed,
  setShippingSpeed,
  onBack,
  onNext,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-black text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Truck size={16} className="text-amber-500" /> Choose Your Delivery Speed
      </h3>

      <div className="space-y-3">
        <label
          className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
            shippingSpeed === 'Prime Free Next-Day'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
              : 'border-gray-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="shippingSpeed"
              checked={shippingSpeed === 'Prime Free Next-Day'}
              onChange={() => setShippingSpeed('Prime Free Next-Day')}
              className="text-amber-500 focus:ring-0 accent-amber-500"
            />
            <div>
              <div className="font-bold text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <span className="italic font-black text-amber-500">Prime</span>
                <span>FREE Next-Day Delivery (Tomorrow by 8:00 PM)</span>
              </div>
              <div className="text-[11px] text-gray-500">Fastest free option included with your Z-Prime status</div>
            </div>
          </div>
          <span className="font-black text-xs text-emerald-600">FREE</span>
        </label>

        <label
          className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
            shippingSpeed === 'Same-Day Priority'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
              : 'border-gray-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="shippingSpeed"
              checked={shippingSpeed === 'Same-Day Priority'}
              onChange={() => setShippingSpeed('Same-Day Priority')}
              className="text-amber-500 focus:ring-0 accent-amber-500"
            />
            <div>
              <div className="font-bold text-xs text-gray-900 dark:text-gray-100">
                Priority Same-Day Express (Today by 9:00 PM)
              </div>
              <div className="text-[11px] text-gray-500">Guaranteed instant dispatch from local warehouse WA-8</div>
            </div>
          </div>
          <span className="font-bold text-xs text-gray-900 dark:text-gray-100">$4.99</span>
        </label>

        <label
          className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
            shippingSpeed === 'Standard Delivery (2-3 Days)'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
              : 'border-gray-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="shippingSpeed"
              checked={shippingSpeed === 'Standard Delivery (2-3 Days)'}
              onChange={() => setShippingSpeed('Standard Delivery (2-3 Days)')}
              className="text-amber-500 focus:ring-0 accent-amber-500"
            />
            <div>
              <div className="font-bold text-xs text-gray-900 dark:text-gray-100">
                Standard Ground Delivery (2-3 Business Days)
              </div>
              <div className="text-[11px] text-gray-500">Eco-consolidated box packaging</div>
            </div>
          </div>
          <span className="font-black text-xs text-emerald-600">FREE</span>
        </label>
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
          className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <span>Continue to Payment</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
