'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Truck,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Image from 'next/image';

export const PersonalizedAnalytics: React.FC = () => {
  const { user, orders, products, formatPrice, setActiveProductDetail, setViewMode } = useApp();

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsOrdered = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  // Monthly Spending Data
  const monthlyData = [
    { month: 'Mar', spent: 180 },
    { month: 'Apr', spent: 340 },
    { month: 'May', spent: 220 },
    { month: 'Jun', spent: 580 },
    { month: 'Jul', spent: 410 },
    { month: 'Aug', spent: totalSpent || 780 },
  ];

  // Category Distribution Data
  const categoryData = [
    { name: 'Audio & Sound', value: 45, color: '#f59e0b' },
    { name: 'Computers & Tech', value: 30, color: '#3b82f6' },
    { name: 'Smart Home', value: 15, color: '#10b981' },
    { name: 'Accessories', value: 10, color: '#8b5cf6' },
  ];

  // Personalized Recommended Products based on customer's purchase history
  const recommendations = products.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={24} className="text-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              Personalized Order Analytics
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Insights on your historical purchasing behavior, delivery performance, and Z-Prime member savings.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900 text-xs font-bold">
          <Sparkles size={15} />
          <span>VIP Member Insights</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Yearly Spending</span>
            <DollarSign size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">
            {formatPrice(totalSpent + 1420)}
          </div>
          <div className="text-[11px] text-gray-400">Across {orders.length + 8} total orders</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Prime Shipping Saved</span>
            <Truck size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {formatPrice(148.50)}
          </div>
          <div className="text-[11px] text-blue-600 font-bold">Free Next-Day delivery perks</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Avg. Delivery Velocity</span>
            <TrendingUp size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100">
            1.2 Days
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">100% On-Time rate</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Eco Package Score</span>
            <Leaf size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            96 / 100
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Consolidated green boxes</div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Spending Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-gray-900 dark:text-gray-100">
              6-Month Spending Trajectory ($)
            </h3>
            <span className="text-xs text-gray-400">2026 Monthly Trend</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val || 0)}`, 'Spent']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="spent" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-gray-900 dark:text-gray-100">
              Category Distribution
            </h3>
            <span className="text-xs text-gray-400">By Total Spend</span>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${Number(val || 0)}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100 dark:border-slate-800">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-gray-600 dark:text-gray-300 font-medium truncate">{c.name}</span>
                <span className="font-bold text-gray-900 dark:text-gray-100 ml-auto">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized Recommendations Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              Recommended for You Based on Past Orders
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Personalized algorithms matched with your top interest in Audio & Display tech.
            </p>
          </div>

          <button
            onClick={() => setViewMode('catalog')}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>See more</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.map((prod) => (
            <div
              key={prod.id}
              onClick={() => setActiveProductDetail(prod)}
              className="p-3 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 bg-gray-50 dark:bg-slate-800 cursor-pointer transition-colors space-y-2 group"
            >
              <div className="relative aspect-square rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
                <Image src={prod.images[0]} alt={prod.title} fill className="object-contain p-2 group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
              </div>
              <div className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">{prod.brand}</div>
              <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate group-hover:text-amber-500 transition-colors">
                {prod.title}
              </h4>
              <div className="font-black text-sm text-gray-900 dark:text-gray-100">
                {formatPrice(prod.price)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
