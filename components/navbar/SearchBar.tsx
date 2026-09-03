'use client';

import React from 'react';
import { ProductCategory } from '@/types/ecommerce';
import { CATEGORIES } from '@/data/mockData';
import { ChevronDown, Search, X } from 'lucide-react';

interface SearchBarProps {
  localSearch: string;
  setLocalSearch: (val: string) => void;
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  setSearchQuery: (query: string) => void;
  viewMode: string;
  setViewMode: (mode: any) => void;
  t: (key: string) => string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  localSearch,
  setLocalSearch,
  selectedCategory,
  setSelectedCategory,
  handleSearchSubmit,
  setSearchQuery,
  viewMode,
  setViewMode,
  t,
}) => {
  return (
    <form
      id="search-form"
      onSubmit={handleSearchSubmit}
      className="flex-1 max-w-3xl flex items-center h-10 rounded-md overflow-hidden bg-white dark:bg-slate-900 border-2 border-amber-400 focus-within:ring-2 focus-within:ring-amber-500 transition-colors shadow-inner"
    >
      <div className="relative hidden sm:block bg-gray-100 dark:bg-slate-800 border-r border-gray-300 dark:border-slate-700 h-full">
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value as ProductCategory);
            if (viewMode !== 'home' && viewMode !== 'catalog') setViewMode('catalog');
          }}
          aria-label="Filter by product category"
          className="h-full bg-transparent text-gray-800 dark:text-gray-200 text-xs font-semibold px-3 py-1 pr-6 cursor-pointer focus:outline-none appearance-none"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800">
              {cat === 'All' ? t('all_categories') : cat}
            </option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-2 top-3.5 text-gray-500 pointer-events-none" />
      </div>

      <input
        id="search-input"
        type="text"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder={t('search_placeholder')}
        className="flex-1 h-full px-3 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 focus:outline-none placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-sm"
      />

      {localSearch && (
        <button
          type="button"
          onClick={() => {
            setLocalSearch('');
            setSearchQuery('');
          }}
          aria-label="Clear search"
          className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
        >
          <X size={16} />
        </button>
      )}

      <button
        id="search-submit-btn"
        type="submit"
        className="h-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Search"
      >
        <Search size={19} />
      </button>
    </form>
  );
};
