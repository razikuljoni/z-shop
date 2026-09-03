'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/ProductCard';
import { ProductCategory } from '@/types/ecommerce';
import {
  SlidersHorizontal,
  Star,
  Check,
  RotateCcw,
  LayoutGrid,
  Grid3X3,
  List,
  Sparkles,
  Zap,
} from 'lucide-react';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Electronics',
  'Computers & Tech',
  'Fashion & Apparel',
  'Home & Kitchen',
  'Audio & Headphones',
  'Gaming & VR',
  'Sports & Outdoors',
];

export const ProductGrid: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    t,
    setIsAdvisorOpen,
  } = useApp();

  // Local Filter States
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [onlyPrime, setOnlyPrime] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'reviews'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available brands computed from catalog
  const allBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand)));
  }, [products]);

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category Filter
        if (selectedCategory !== 'All' && product.category !== selectedCategory) {
          return false;
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = product.title.toLowerCase().includes(q);
          const matchesBrand = product.brand.toLowerCase().includes(q);
          const matchesCategory = product.category.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesDeal = q === 'deal' && (product.isLightningDeal || (product.originalPrice && product.originalPrice > product.price));
          if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesDesc && !matchesDeal) {
            return false;
          }
        }

        // Rating Filter
        if (minRating > 0 && product.rating < minRating) {
          return false;
        }

        // Price Filter
        if (product.price > maxPrice) {
          return false;
        }

        // Prime Filter
        if (onlyPrime && !product.isPrime) {
          return false;
        }

        // In Stock Filter
        if (onlyInStock && product.stock <= 0) {
          return false;
        }

        // Brand Filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, minRating, maxPrice, onlyPrime, onlyInStock, selectedBrands, sortBy]);

  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinRating(0);
    setMaxPrice(1500);
    setOnlyPrime(false);
    setOnlyInStock(false);
    setSelectedBrands([]);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    minRating > 0 ||
    maxPrice < 1500 ||
    onlyPrime ||
    onlyInStock ||
    selectedBrands.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              {searchQuery ? `Results for "${searchQuery}"` : selectedCategory === 'All' ? 'All Products & Deals' : selectedCategory}
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              {filteredProducts.length} items
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Prices and delivery availability are verified in real time
          </p>
        </div>

        {/* Action Controls: Mobile Filter Toggle, Sort Dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-xs font-bold border border-gray-200 dark:border-slate-700"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 dark:text-gray-400 font-medium hidden sm:inline">{t('sort_by')}:</span>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-xs font-bold shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="featured">{t('featured')}</option>
              <option value="price-asc">{t('price_low_high')}</option>
              <option value="price-desc">{t('price_high_low')}</option>
              <option value="rating">{t('customer_reviews')}</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>

          {/* Ask AI Genie button */}
          <button
            onClick={() => setIsAdvisorOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold hover:bg-purple-100 transition-colors"
          >
            <Sparkles size={14} className="text-purple-500" />
            <span>AI Advice</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 py-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Active filters:</span>

          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('All')} className="hover:text-black">×</button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')} className="hover:text-black">×</button>
            </span>
          )}

          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 text-xs font-bold px-2.5 py-1 rounded-full">
              {minRating}★ & Up
              <button onClick={() => setMinRating(0)} className="hover:text-black">×</button>
            </span>
          )}

          {onlyPrime && (
            <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full">
              Prime Only
              <button onClick={() => setOnlyPrime(false)} className="hover:text-black">×</button>
            </span>
          )}

          {selectedBrands.map((b) => (
            <span key={b} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 text-xs font-bold px-2.5 py-1 rounded-full">
              Brand: {b}
              <button onClick={() => handleToggleBrand(b)} className="hover:text-black">×</button>
            </span>
          ))}

          <button
            onClick={handleResetFilters}
            className="text-xs text-red-600 dark:text-red-400 hover:underline font-bold flex items-center gap-1 ml-2"
          >
            <RotateCcw size={12} /> Clear all
          </button>
        </div>
      )}

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
        {/* Sidebar Filters */}
        <aside
          className={`space-y-6 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 h-fit ${
            isMobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          {/* Department / Categories */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-2.5">
              Department
            </h3>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cat === 'All' ? t('all_categories') : cat}</span>
                  {selectedCategory === cat && <Check size={13} className="text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-800" />

          {/* Prime Delivery Filter */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-2.5">
              Shipping & Delivery
            </h3>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                checked={onlyPrime}
                onChange={(e) => setOnlyPrime(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <span className="italic font-black text-blue-600 dark:text-blue-400">Prime</span>
                <span>One-Day Delivery</span>
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-gray-800 dark:text-gray-200 mt-2">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-800" />

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 dark:text-gray-100">
                Max Price
              </h3>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                ${maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="1500"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
              <span>$20</span>
              <span>$750</span>
              <span>$1500+</span>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-800" />

          {/* Customer Rating Filter */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-2.5">
              Avg. Customer Review
            </h3>
            <div className="space-y-1.5">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`flex items-center gap-1 text-xs py-1 px-2 rounded w-full transition-colors ${
                    minRating === stars ? 'bg-amber-100 dark:bg-amber-950 font-bold' : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < stars ? 'fill-current' : 'text-gray-300 dark:text-slate-700'}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 ml-1">& Up</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-800" />

          {/* Brands Filter */}
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-2.5">
              Brand
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {allBrands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleToggleBrand(brand)}
                    className="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Cards Container */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-amber-100 dark:bg-slate-800 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                No matching products found
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                Try loosening your filters, adjusting the max price slider, or searching for other electronics, tech, or audio gear.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
