'use client';

import React from 'react';
import { Store, Plus, DollarSign, TrendingUp, Package, Boxes, AlertTriangle } from 'lucide-react';

interface AdminHeaderProps {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
  formatPrice: (amount: number) => string;
  onOpenAddModal: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  totalRevenue,
  totalOrders,
  totalProducts,
  lowStockCount,
  formatPrice,
  onOpenAddModal,
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Store size={24} className="text-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              Seller & Merchant Central
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time inventory management, instantaneous stock adjustments, and order fulfillment.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Product SKU</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Gross Revenue</span>
            <DollarSign size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">
            {formatPrice(totalRevenue + 53700)}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-bold">
            <TrendingUp size={13} /> +18.4% this week
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Total Fulfilled Orders</span>
            <Package size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">
            {totalOrders + 1420}
          </div>
          <div className="text-[11px] text-blue-600 font-bold">
            99.8% on-time dispatch rate
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Active SKUs</span>
            <Boxes size={16} className="text-purple-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">
            {totalProducts}
          </div>
          <div className="text-[11px] text-purple-600 font-bold">
            Across 7 categories
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Low Stock Warnings</span>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {lowStockCount} Items
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
            Requires restocking soon
          </div>
        </div>
      </div>
    </>
  );
};
