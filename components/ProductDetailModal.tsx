'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Product, ProductVariant } from '@/types/ecommerce';
import {
  X,
  Heart,
  Star,
  Truck,
  ShoppingCart,
  Zap,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import Image from 'next/image';
import { ProductBundleSection } from './product/ProductBundleSection';
import { ProductDetailTabs } from './product/ProductDetailTabs';

export const useProductDetailState = (product: Product | null, products: Product[]) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ai_summary' | 'ask_ai'>('details');

  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAskingAi, setIsAskingAi] = useState(false);

  const [prevProductId, setPrevProductId] = useState<string | undefined>(undefined);

  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id);
    setSelectedVariant(product.variants?.[0]);
    setQuantity(1);
    setActiveTab('details');
    setAiSummary('');
    setAiAnswer('');
    setUserQuestion('');
  }

  const isGeneratingRef = useRef(false);
  const isAskingRef = useRef(false);

  const generateAiReviewSummary = async () => {
    if (!product || isGeneratingRef.current) return;
    isGeneratingRef.current = true;
    setIsGeneratingSummary(true);
    setTimeout(() => {
      setAiSummary(
        `Based on 1,200+ verified customer reviews: Users rate this ${product.brand} product highly (4.8/5) for build durability, ergonomic feel, and battery backup. Primary praise: "Premium feel and instant connectivity." 94% of buyers recommend this product.`
      );
      setIsGeneratingSummary(false);
      isGeneratingRef.current = false;
    }, 800);
  };

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim() || isAskingRef.current) return;
    isAskingRef.current = true;
    setIsAskingAi(true);
    setTimeout(() => {
      setAiAnswer(
        `🤖 Z-Genie AI Response: Regarding "${userQuestion}" for ${product?.title}: Yes, this SKU fully supports standard protocol features, fast charging, and official 1-year manufacturer warranty.`
      );
      setIsAskingAi(false);
      isAskingRef.current = false;
    }, 600);
  };

  const bundleProducts = products
    .filter((p) => p.id !== product?.id && p.category === product?.category)
    .slice(0, 2);

  const activeBundleItems = bundleProducts;

  return {
    selectedVariant,
    setSelectedVariant,
    quantity,
    setQuantity,
    activeTab,
    setActiveTab,
    aiSummary,
    isGeneratingSummary,
    generateAiReviewSummary,
    userQuestion,
    setUserQuestion,
    aiAnswer,
    isAskingAi,
    handleAskAi,
    bundleProducts,
    activeBundleItems,
  };
};

export const ProductGallery: React.FC<{ images: string[]; title: string }> = ({ images, title }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="lg:col-span-5 space-y-4">
      <div className="relative aspect-square w-full rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 overflow-hidden group">
        <Image
          src={images[activeImageIndex] || images[0]}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          priority
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              type="button"
              key={img}
              onClick={() => setActiveImageIndex(idx)}
              aria-label={`View product image ${idx + 1}`}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                activeImageIndex === idx
                  ? 'border-amber-500 ring-2 ring-amber-500/30'
                  : 'border-gray-200 dark:border-slate-800 opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={img} alt="" fill sizes="64px" className="object-contain p-1" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductDetail,
    setActiveProductDetail,
    addToCart,
    products,
    formatPrice,
    wishlist,
    toggleWishlist,
    setIsCheckoutOpen,
    t,
  } = useApp();

  const product = activeProductDetail;
  const detail = useProductDetailState(product, products);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const currentStock = detail.selectedVariant ? detail.selectedVariant.stock : product.stock;
  const currentPrice = product.price + (detail.selectedVariant?.priceDelta || 0);
  const bundleTotal = currentPrice + detail.activeBundleItems.reduce((sum, p) => sum + p.price, 0);
  const discountedBundleTotal = bundleTotal * 0.9;

  const handleAddBundleToCart = () => {
    addToCart(product, detail.selectedVariant, 1);
    detail.activeBundleItems.forEach((item) => addToCart(item, undefined, 1));
  };

  const handleBuyNow = () => {
    addToCart(product, detail.selectedVariant, detail.quantity);
    setActiveProductDetail(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              {product.category}
            </span>
            <span className="text-gray-400 dark:text-slate-600">•</span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Sold by {product.sellerName} ({product.sellerRating}★)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isWishlisted
                  ? 'text-red-500 bg-red-50 dark:bg-red-950/50'
                  : 'text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
            </button>

            <button
              type="button"
              id="close-pdp-modal-btn"
              onClick={() => setActiveProductDetail(null)}
              aria-label="Close product details modal"
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <ProductGallery images={product.images} title={product.title} />

            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                  {product.brand} Flagship Store
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 leading-snug">
                  {product.title}
                </h1>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center text-amber-500">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      size={15}
                      className={
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 dark:text-slate-700'
                      }
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-900 dark:text-gray-100">{product.rating}</span>
                <span className="text-gray-400">({product.reviewCount.toLocaleString()} customer reviews)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  Verified Authentic
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-800 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                    {formatPrice(currentPrice)}
                  </span>
                  {product.originalPrice && product.originalPrice > currentPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-bold px-2 py-0.5 rounded">
                      Save {formatPrice(product.originalPrice - currentPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs pt-1">
                  <Truck size={14} className="text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    FREE Prime Next-Day Delivery.
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">Order within 3 hrs 24 mins</span>
                </div>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    Select Option:{' '}
                    <span className="text-amber-600 dark:text-amber-400">{detail.selectedVariant?.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => detail.setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          detail.selectedVariant?.id === v.id
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                            : 'border-gray-200 dark:border-slate-700 hover:border-gray-400'
                        }`}
                      >
                        {v.name} {v.stock <= 3 && <span className="text-red-500 text-[10px]">({v.stock} left)</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Availability:</span>
                  <span
                    className={`font-bold ${currentStock > 5 ? 'text-emerald-600' : 'text-amber-600 dark:text-amber-400'}`}
                  >
                    {currentStock > 5 ? `In Stock (${currentStock} units)` : `Only ${currentStock} left - order soon`}
                  </span>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                  <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => detail.setQuantity(Math.max(1, detail.quantity - 1))}
                      aria-label="Decrease quantity"
                      className="px-3 py-2 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-slate-700 rounded-l-xl cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-bold text-sm text-gray-900 dark:text-gray-100">
                      {detail.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => detail.setQuantity(detail.quantity + 1)}
                      aria-label="Increase quantity"
                      className="px-3 py-2 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-slate-700 rounded-r-xl cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    id="pdp-add-to-cart-btn"
                    onClick={() => addToCart(product, detail.selectedVariant, detail.quantity)}
                    className="flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart size={18} />
                    <span>{t('add_to_cart')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="py-3 px-5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap size={18} />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-slate-800 text-[11px] text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-500" /> 2-Yr Warranty
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw size={16} className="text-blue-500" /> 30-Day Return
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck size={16} className="text-amber-500" /> Free Dispatch
                </div>
              </div>
            </div>
          </div>

          <ProductBundleSection
            product={product}
            bundleProducts={detail.bundleProducts}
            bundleTotal={bundleTotal}
            discountedBundleTotal={discountedBundleTotal}
            formatPrice={formatPrice}
            handleAddBundleToCart={handleAddBundleToCart}
          />

          <ProductDetailTabs
            product={product}
            activeTab={detail.activeTab}
            setActiveTab={detail.setActiveTab}
            aiSummary={detail.aiSummary}
            isGeneratingSummary={detail.isGeneratingSummary}
            generateAiReviewSummary={detail.generateAiReviewSummary}
            userQuestion={detail.userQuestion}
            setUserQuestion={detail.setUserQuestion}
            isAskingAi={detail.isAskingAi}
            aiAnswer={detail.aiAnswer}
            handleAskAi={detail.handleAskAi}
          />
        </div>
      </div>
    </div>
  );
};
