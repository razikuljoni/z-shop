'use client';

import React from 'react';
import { Product } from '@/types/ecommerce';
import { Sparkles, Plus } from 'lucide-react';
import Image from 'next/image';

interface ProductBundleSectionProps {
  product: Product;
  bundleProducts: Product[];
  bundleTotal: number;
  discountedBundleTotal: number;
  formatPrice: (amount: number) => string;
  handleAddBundleToCart: () => void;
}

export const ProductBundleSection: React.FC<ProductBundleSectionProps> = ({
  product,
  bundleProducts,
  bundleTotal,
  discountedBundleTotal,
  formatPrice,
  handleAddBundleToCart,
}) => {
  if (bundleProducts.length === 0) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/80 dark:border-slate-700 space-y-3">
      <h3 className="font-black text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Sparkles size={16} className="text-amber-500" /> Frequently Bought Together
      </h3>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-16 h-16 bg-white dark:bg-slate-900 rounded-lg p-1 border border-gray-200 dark:border-slate-700 shrink-0">
          <Image src={product.images[0]} alt="" fill sizes="64px" className="object-contain" referrerPolicy="no-referrer" />
        </div>

        {bundleProducts.map((bundleItem) => (
          <React.Fragment key={bundleItem.id}>
            <Plus size={16} className="text-gray-400" />
            <div className="relative w-16 h-16 bg-white dark:bg-slate-900 rounded-lg p-1 border border-gray-200 dark:border-slate-700 shrink-0">
              <Image src={bundleItem.images[0]} alt="" fill sizes="64px" className="object-contain" referrerPolicy="no-referrer" />
            </div>
          </React.Fragment>
        ))}

        <div className="sm:ml-auto space-y-1">
          <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
            Bundle Total: <span className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(discountedBundleTotal)}</span>{' '}
            <span className="line-through text-gray-400 text-[11px]">{formatPrice(bundleTotal)}</span>
          </div>
          <button
            type="button"
            onClick={handleAddBundleToCart}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Bundle to Cart (10% Off)
          </button>
        </div>
      </div>
    </div>
  );
};
