'use client';

import React from 'react';
import { Product, ProductCategory } from '@/types/ecommerce';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  newProd: Partial<Product>;
  setNewProd: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  handleCreateProduct: (e: React.FormEvent) => void;
}

const parseNumberInput = (val: string): number => {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  newProd,
  setNewProd,
  handleCreateProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-gray-200 dark:border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3">
          <h3 className="font-black text-base text-gray-900 dark:text-gray-100">
            Add New Catalog Product
          </h3>
          <button onClick={onClose} aria-label="Close add product modal" className="text-gray-400 font-bold cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
          <div>
            <label htmlFor="new-product-title" className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Product Title</label>
            <input
              id="new-product-title"
              type="text"
              required
              aria-label="Product Title"
              value={newProd.title || ''}
              onChange={(e) => setNewProd((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. AuraPods Max Wireless ANC Headphones"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="new-product-brand" className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Brand Name</label>
              <input
                id="new-product-brand"
                type="text"
                required
                aria-label="Brand Name"
                value={newProd.brand || ''}
                onChange={(e) => setNewProd((prev) => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g. AuraAudio"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label htmlFor="new-product-category" className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Department</label>
              <select
                id="new-product-category"
                aria-label="Department"
                value={newProd.category || 'Electronics'}
                onChange={(e) => setNewProd((prev) => ({ ...prev, category: e.target.value as ProductCategory }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Electronics">Electronics</option>
                <option value="Computers & Tech">Computers & Tech</option>
                <option value="Audio & Headphones">Audio & Headphones</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Gaming & VR">Gaming & VR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="new-product-price" className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Price ($)</label>
              <input
                id="new-product-price"
                type="number"
                step="0.01"
                required
                aria-label="Price"
                value={newProd.price || 0}
                onChange={(e) => setNewProd((prev) => ({ ...prev, price: parseNumberInput(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label htmlFor="new-product-original-price" className="font-bold text-gray-700 dark:text-gray-300 block mb-1">List Price ($)</label>
              <input
                id="new-product-original-price"
                type="number"
                step="0.01"
                aria-label="List Price"
                value={newProd.originalPrice || 0}
                onChange={(e) => setNewProd((prev) => ({ ...prev, originalPrice: parseNumberInput(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label htmlFor="new-product-stock" className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Initial Stock</label>
              <input
                id="new-product-stock"
                type="number"
                required
                aria-label="Initial Stock"
                value={newProd.stock || 0}
                onChange={(e) => setNewProd((prev) => ({ ...prev, stock: parseNumberInput(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="new-product-image" className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Image URL (Unsplash/Web)</label>
            <input
              id="new-product-image"
              type="text"
              aria-label="Image URL"
              value={newProd.images?.[0] || ''}
              onChange={(e) => setNewProd((prev) => ({ ...prev, images: [e.target.value] }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="new-product-is-prime"
              type="checkbox"
              aria-label="Qualifies for Z-Prime Fast Shipping"
              checked={newProd.isPrime || false}
              onChange={(e) => setNewProd((prev) => ({ ...prev, isPrime: e.target.checked }))}
              className="w-4 h-4 rounded text-amber-500 focus:ring-0 accent-amber-500"
            />
            <label htmlFor="new-product-is-prime" className="font-bold text-gray-800 dark:text-gray-200">Qualifies for Z-Prime Fast Shipping</label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg shadow-md cursor-pointer"
            >
              Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
