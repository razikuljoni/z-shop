'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types/ecommerce';
import { AdminHeader } from './admin/AdminHeader';
import { AdminInventoryTab } from './admin/AdminInventoryTab';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminAnalyticsTab } from './admin/AdminAnalyticsTab';
import { AddProductModal } from './admin/AddProductModal';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    updateProductStock,
    addNewProduct,
    deleteProduct,
    updateOrderStatusByAdmin,
    formatPrice,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newProd, setNewProd] = useState<Partial<Product>>({
    title: '',
    brand: '',
    category: 'Electronics',
    price: 99.99,
    originalPrice: 129.99,
    stock: 25,
    rating: 4.8,
    reviewCount: 1,
    isPrime: true,
    description: '',
    features: ['High durability', 'Premium build quality'],
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    specifications: { 'Warranty': '1 Year' },
    sellerName: 'Z Shop Official',
    sellerRating: 4.9,
    reviews: [],
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockChange = (productId: string, newStock: number) => {
    if (newStock < 0) return;
    updateProductStock(productId, newStock);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.title || !newProd.price) {
      alert('Please provide product title and price.');
      return;
    }

    const created: Product = {
      id: `prod-custom-${Math.random().toString(36).substring(2, 9)}`,
      title: newProd.title || 'Untitled Product',
      brand: newProd.brand || 'Z Shop Global',
      category: newProd.category || 'Electronics',
      price: Number(newProd.price),
      originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : undefined,
      stock: Number(newProd.stock) || 20,
      rating: 5.0,
      reviewCount: 1,
      isPrime: !!newProd.isPrime,
      description: newProd.description || 'Premium engineered product available exclusively on Z Shop.',
      features: newProd.features || ['Premium standard'],
      images: newProd.images || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
      specifications: { 'Build': 'Anodized Alloy' },
      sellerName: 'Z Shop Merchant Hub',
      sellerRating: 4.9,
      returnPolicy: '30-Day Free Return & Replacement',
      reviews: [],
    };

    addNewProduct(created);
    setIsAddModalOpen(false);
    alert(`Successfully added "${created.title}" to catalog.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6">
      <AdminHeader
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        totalProducts={totalProducts}
        lowStockCount={lowStockCount}
        formatPrice={formatPrice}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          📦 Real-Time Inventory ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          🚚 Order Fulfillment ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          📊 Sales Insights & Trends
        </button>
      </div>

      {activeTab === 'inventory' && (
        <AdminInventoryTab
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredProducts={filteredProducts}
          formatPrice={formatPrice}
          handleStockChange={handleStockChange}
          deleteProduct={deleteProduct}
        />
      )}

      {activeTab === 'orders' && (
        <AdminOrdersTab
          orders={orders}
          formatPrice={formatPrice}
          updateOrderStatusByAdmin={updateOrderStatusByAdmin}
        />
      )}

      {activeTab === 'analytics' && <AdminAnalyticsTab />}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        newProd={newProd}
        setNewProd={setNewProd}
        handleCreateProduct={handleCreateProduct}
      />
    </div>
  );
};
