'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/types/ecommerce';
import { useApp } from '@/context/AppContext';
import {
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Check,
  Award,
  Flame,
} from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center text-amber-500 text-xs">
    {[0, 1, 2, 3, 4].map((i) => (
      <Star
        key={i}
        size={13}
        className={i < Math.floor(rating) ? 'fill-current' : 'text-gray-300 dark:text-slate-700'}
      />
    ))}
  </div>
);

const StockBadge: React.FC<{ stock: number; t: (key: string, options?: any) => string }> = ({ stock, t }) => {
  if (stock <= 0) return <span className="text-red-600 font-bold">Out of Stock</span>;
  if (stock <= 5) return <span className="text-amber-600 dark:text-amber-400 font-bold">{t('only_left', { count: stock })}</span>;
  return <span className="text-emerald-600 dark:text-emerald-400 font-medium">{t('in_stock')} ({stock})</span>;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    addToCart,
    wishlist,
    toggleWishlist,
    setActiveProductDetail,
    t,
  } = useApp();

  const [isAdded, setIsAdded] = useState(false);
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const discountPercent = useMemo(
    () => (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0),
    [product.originalPrice, product.price]
  );

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setActiveProductDetail(product);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if ((e.target as HTMLElement).closest('button')) return;
      e.preventDefault();
      setActiveProductDetail(product);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      role="group"
      aria-label={product.title}
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500/60 transition-colors transition-shadow duration-300 cursor-pointer"
    >
      {/* Top Badges & Wishlist Action */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex flex-wrap items-center gap-1">
            {product.isBestSeller && (
              <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                <Award size={11} /> #1 Best Seller
              </span>
            )}
            {product.isLightningDeal && (
              <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm animate-pulse">
                <Flame size={11} /> Lightning Deal
              </span>
            )}
            {!product.isBestSeller && !product.isLightningDeal && discountPercent > 0 && (
              <span className="bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <button
            id={`wishlist-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-1.5 rounded-full transition-colors ${
              isWishlisted
                ? 'text-red-500 bg-red-50 dark:bg-red-950/50'
                : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
            aria-label="Save to Wishlist"
          >
            <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Product Image Stage */}
        <div className="relative w-full aspect-square bg-gray-50 dark:bg-slate-800/60 rounded-lg overflow-hidden mb-3">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-gray-900 dark:text-gray-100 text-xs font-bold shadow-lg backdrop-blur-sm">
              <Eye size={14} /> Quick View
            </span>
          </div>
        </div>

        {/* Brand & Title */}
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">
          {product.brand}
        </div>

        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 leading-snug mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {product.title}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mb-2">
          <RatingStars rating={product.rating} />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Lightning Deal Progress Bar if active */}
        {product.isLightningDeal && (
          <div className="mb-2">
            <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
              <span className="font-bold text-red-600 dark:text-red-400">82% Claimed</span>
              <span>Ends in 4h 12m</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full w-[82%]" />
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Prime Shipping Badge & Delivery */}
        <div className="flex items-center gap-1.5 text-xs mb-2">
          {product.isPrime ? (
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
              <span className="italic font-black text-amber-500">Prime</span>
              <span>{t('tomorrow')}</span>
            </span>
          ) : (
            <span className="text-gray-500 text-xs">Standard 2-3 Days</span>
          )}
        </div>

        {/* Stock Level Indicator */}
        <div className="text-xs mb-3">
          <StockBadge stock={product.stock} t={t} />
        </div>
      </div>

      {/* Bottom Action: Add to Cart */}
      <button
        id={`add-to-cart-btn-${product.id}`}
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
          product.stock <= 0
            ? 'bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
            : isAdded
            ? 'bg-emerald-600 text-white'
            : 'bg-amber-400 hover:bg-amber-500 text-slate-950 hover:shadow-md cursor-pointer'
        }`}
      >
        {isAdded ? (
          <>
            <Check size={16} className="stroke-[3]" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <ShoppingCart size={15} />
            <span>{t('add_to_cart')}</span>
          </>
        )}
      </button>
    </div>
  );
};
