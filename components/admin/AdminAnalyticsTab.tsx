'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });

const SALES_CHART_DATA = [
  { day: 'Mon', revenue: 4200, orders: 38 },
  { day: 'Tue', revenue: 5800, orders: 49 },
  { day: 'Wed', revenue: 7200, orders: 64 },
  { day: 'Thu', revenue: 6400, orders: 55 },
  { day: 'Fri', revenue: 9800, orders: 82 },
  { day: 'Sat', revenue: 11400, orders: 95 },
  { day: 'Sun', revenue: 8900, orders: 74 },
];

const CATEGORY_SALES_DATA = [
  { category: 'Audio', sales: 18400 },
  { category: 'Computers', sales: 24200 },
  { category: 'Electronics', sales: 31000 },
  { category: 'Home', sales: 12500 },
  { category: 'Gaming', sales: 19800 },
];

export const AdminAnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-black text-sm text-gray-900 dark:text-gray-100">
            Weekly Revenue Trend ($)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_CHART_DATA}>
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

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-black text-sm text-gray-900 dark:text-gray-100">
            Revenue by Department ($)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_SALES_DATA}>
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
  );
};
