'use client';

import React from 'react';
import Image from 'next/image';
import { CartItem } from '@/types/ecommerce';

interface SavedForLaterSectionProps {
  savedForLater: CartItem[];
  formatPrice: (amount: number) => string;
  moveToCartFromSaved: (item: CartItem) => void;
  title: string;
}

export const SavedForLaterSection: React.FC<SavedForLaterSectionProps> = ({
  savedForLater,
  formatPrice,
  moveToCartFromSaved,
  title,
}) => {
  if (savedForLater.length === 0) return null;

  return (
    <div className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-2">
      <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
        {title} ({savedForLater.length})
      </h3>
      <div className="space-y-2">
        {savedForLater.map((sItem) => (
          <div
            key={`${sItem.productId}-${sItem.variantId || 'base'}`}
            className="p-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative w-10 h-10 bg-white dark:bg-slate-900 rounded p-1 shrink-0 border border-gray-200 dark:border-slate-700">
                <Image
                  src={sItem.product.images[0]}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="truncate">
                <div className="font-bold text-gray-900 dark:text-gray-100 truncate">{sItem.product.title}</div>
                <div className="text-gray-600 dark:text-gray-400">{formatPrice(sItem.product.price)}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => moveToCartFromSaved(sItem)}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs shrink-0 cursor-pointer"
            >
              Move to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
