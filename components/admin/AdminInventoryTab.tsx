'use client';

import React from 'react';
import { Product } from '@/types/ecommerce';
import { Search, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface AdminInventoryTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  formatPrice: (amount: number) => string;
  handleStockChange: (productId: string, newStock: number) => void;
  deleteProduct: (productId: string) => void;
}

const parseNumberInput = (val: string): number => {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

interface AdminInventoryRowProps {
  prod: Product;
  formatPrice: (amount: number) => string;
  handleStockChange: (productId: string, newStock: number) => void;
  deleteProduct: (productId: string) => void;
}

const AdminInventoryRow: React.FC<AdminInventoryRowProps> = ({
  prod,
  formatPrice,
  handleStockChange,
  deleteProduct,
}) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-slate-700">
          <Image src={prod.images[0]} alt={prod.title} fill sizes="40px" className="object-contain p-1" referrerPolicy="no-referrer" />
        </div>
        <div className="min-w-0 max-w-xs">
          <div className="font-bold text-gray-900 dark:text-gray-100 truncate">{prod.title}</div>
          <div className="text-[10px] text-gray-400">{prod.brand} • SKU: {prod.id}</div>
        </div>
      </div>
    </td>

    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">
      {prod.category}
    </td>

    <td className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100">
      {formatPrice(prod.price)}
    </td>

    <td className="px-4 py-3">
      {prod.isPrime ? (
        <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-black text-xs italic">
          Prime ✓
        </span>
      ) : (
        <span className="text-gray-400 text-xs">Standard</span>
      )}
    </td>

    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max="9999"
          value={prod.stock}
          onChange={(e) => handleStockChange(prod.id, parseNumberInput(e.target.value))}
          aria-label={`Update stock quantity for ${prod.title}`}
          className={`w-20 px-2 py-1 rounded border font-mono font-bold text-xs ${
            prod.stock <= 5
              ? 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
              : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100'
          }`}
        />
        {prod.stock <= 5 && (
          <span className="text-[10px] text-red-500 font-bold">Low</span>
        )}
      </div>
    </td>

    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
      {prod.rating}★ ({prod.reviewCount})
    </td>

    <td className="px-4 py-3 text-right">
      <button
        onClick={() => {
          if (confirm(`Are you sure you want to delete "${prod.title}"?`)) {
            deleteProduct(prod.id);
          }
        }}
        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
        title="Delete Product"
      >
        <Trash2 size={16} />
      </button>
    </td>
  </tr>
);

const INVENTORY_COLUMNS = ['Product', 'Category', 'Price', 'Prime Status', 'Live Stock Units', 'Rating'];

const InventoryTableHeader: React.FC = () => (
  <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-slate-700">
    <tr>
      {INVENTORY_COLUMNS.map((col) => (
        <th key={col} className="px-4 py-3">{col}</th>
      ))}
      <th className="px-4 py-3 text-right">Actions</th>
    </tr>
  </thead>
);

export const AdminInventoryTab: React.FC<AdminInventoryTabProps> = ({
  searchTerm,
  setSearchTerm,
  filteredProducts,
  formatPrice,
  handleStockChange,
  deleteProduct,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search SKU, brand, or title..."
            aria-label="Search SKU, brand, or title"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <div className="text-xs text-gray-500 font-semibold">
          Tip: Edit the number in the stock column to instantly update real-time catalog quantity.
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <InventoryTableHeader />
          <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
            {filteredProducts.map((prod) => (
              <AdminInventoryRow
                key={prod.id}
                prod={prod}
                formatPrice={formatPrice}
                handleStockChange={handleStockChange}
                deleteProduct={deleteProduct}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
