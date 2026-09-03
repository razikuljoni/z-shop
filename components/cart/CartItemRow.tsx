'use client';

import React from 'react';
import Image from 'next/image';
import { CartItem } from '@/types/ecommerce';
import { Bookmark, Trash2, Gift } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
  formatPrice: (amount: number) => string;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  saveForLater: (productId: string, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  toggleGiftStatus: (productId: string, isGift: boolean) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  formatPrice,
  updateCartQuantity,
  saveForLater,
  removeFromCart,
  toggleGiftStatus,
}) => {
  const itemPrice = item.product.price + (item.selectedVariant?.priceDelta || 0);

  return (
    <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 space-y-2.5">
      <div className="flex gap-3">
        {/* Product Thumbnail */}
        <div className="relative w-16 h-16 bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shrink-0">
          <Image
            src={item.product.images[0]}
            alt={item.product.title}
            fill
            sizes="64px"
            className="object-contain p-1"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">{item.product.brand}</div>
          <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate">{item.product.title}</h4>
          {item.selectedVariant && (
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              Option: {item.selectedVariant.name}
            </div>
          )}
          <div className="font-black text-sm text-gray-900 dark:text-gray-100 mt-1">{formatPrice(itemPrice)}</div>
        </div>
      </div>

      {/* Quantity and Actions Bar */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200/60 dark:border-slate-800">
        {/* Qty Controls */}
        <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.variantId)}
            aria-label="Decrease quantity"
            className="px-2 py-0.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            -
          </button>
          <span className="px-2.5 py-0.5 font-bold text-gray-900 dark:text-gray-100">{item.quantity}</span>
          <button
            type="button"
            onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.variantId)}
            aria-label="Increase quantity"
            className="px-2 py-0.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            +
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center gap-3 text-[11px]">
          <button
            type="button"
            onClick={() => saveForLater(item.productId, item.variantId)}
            className="text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 font-medium"
          >
            <Bookmark size={13} /> Save for later
          </button>

          <button
            type="button"
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
};
