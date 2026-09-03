'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Product, Order, ProductCategory } from '@/types/ecommerce';
import {
  Store,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Check,
  Search,
  Truck,
  DollarSign,
  Boxes,
  ArrowUpRight,
  ShieldAlert,
  BarChart2,
  RefreshCw,
} from 'lucide-react';
import Image from 'next/image';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    updateProductStock,
    addNewProduct,
    deleteProduct,
    updateOrderStatusByAdmin,
    formatPrice,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Product Form State
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

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  // Filtered Products
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

  // Mock Analytics Data for Recharts
  const salesChartData = [
    { day: 'Mon', revenue: 4200, orders: 38 },
    { day: 'Tue', revenue: 5800, orders: 49 },
    { day: 'Wed', revenue: 7200, orders: 64 },
    { day: 'Thu', revenue: 6400, orders: 55 },
    { day: 'Fri', revenue: 9800, orders: 82 },
    { day: 'Sat', revenue: 11400, orders: 95 },
    { day: 'Sun', revenue: 8900, orders: 74 },
  ];

  const categorySalesData = [
    { category: 'Audio', sales: 18400 },
    { category: 'Computers', sales: 24200 },
    { category: 'Electronics', sales: 31000 },
    { category: 'Home', sales: 12500 },
    { category: 'Gaming', sales: 19800 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6">
      {/* Top Banner Header */}
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
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Product SKU</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
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

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'inventory'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          📦 Real-Time Inventory ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'orders'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          🚚 Order Fulfillment ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'analytics'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          📊 Sales Insights & Trends
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search SKU, brand, or title..."
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
              <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Prime Status</th>
                  <th className="px-4 py-3">Live Stock Units</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-slate-700">
                          <Image src={prod.images[0]} alt={prod.title} fill className="object-contain p-1" referrerPolicy="no-referrer" />
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
                          onChange={(e) => handleStockChange(prod.id, Number(e.target.value))}
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
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER FULFILLMENT HUB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer & Address</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Fulfillment Status</th>
                  <th className="px-4 py-3 text-right">Advance Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-gray-100">
                      {order.id}
                      <div className="text-[10px] text-gray-400 font-sans">{order.placedAt}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900 dark:text-gray-100">{order.shippingAddress.fullName}</div>
                      <div className="text-[11px] text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.state}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-gray-800 dark:text-gray-200 font-semibold">
                        {order.items.length} item(s)
                      </div>
                      <div className="text-[10px] text-gray-400 truncate max-w-xs">
                        {order.items.map((i) => i.product.title).join(', ')}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-black text-gray-900 dark:text-gray-100">
                      {formatPrice(order.total)}
                    </td>

                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {order.paymentMethod}
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatusByAdmin(order.id, e.target.value as any)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 cursor-pointer"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          const nextStatus: Record<string, Order['status']> = {
                            'Order Placed': 'Processing',
                            'Processing': 'Shipped',
                            'Shipped': 'Out for Delivery',
                            'Out for Delivery': 'Delivered',
                            'Delivered': 'Delivered',
                          };
                          updateOrderStatusByAdmin(order.id, nextStatus[order.status] || 'Processing');
                        }}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs shadow-sm transition-colors"
                      >
                        Next Step →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SALES ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Revenue Area Chart */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-black text-sm text-gray-900 dark:text-gray-100">
                Weekly Revenue Trend ($)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesChartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip
                      formatter={(val: any) => [`$${Number(val || 0).toLocaleString()}`, 'Revenue']}
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Sales Bar Chart */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-black text-sm text-gray-900 dark:text-gray-100">
                Revenue by Department ($)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categorySalesData}>
                    <XAxis dataKey="category" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip
                      formatter={(val: any) => [`$${Number(val || 0).toLocaleString()}`, 'Sales']}
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                    />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-gray-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-gray-900 dark:text-gray-100">
                Add New Catalog Product
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProd.title}
                  onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                  placeholder="e.g. AuraPods Max Wireless ANC Headphones"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    placeholder="e.g. AuraAudio"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Department</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value as ProductCategory })}
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
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">List Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Image URL (Unsplash/Web)</label>
                <input
                  type="text"
                  value={newProd.images?.[0]}
                  onChange={(e) => setNewProd({ ...newProd, images: [e.target.value] })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={newProd.isPrime}
                  onChange={(e) => setNewProd({ ...newProd, isPrime: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 accent-amber-500"
                />
                <span className="font-bold text-gray-800 dark:text-gray-200">Qualifies for Z-Prime Fast Shipping</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg shadow-md"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
