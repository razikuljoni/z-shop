'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { LiveTrackingModal } from '@/components/LiveTrackingModal';
import { OrderHistoryView } from '@/components/OrderHistoryView';
import { AdminDashboard } from '@/components/AdminDashboard';
import { PersonalizedAnalytics } from '@/components/PersonalizedAnalytics';
import { AIAdvisorDrawer } from '@/components/AIAdvisorDrawer';
import { NotificationCenter } from '@/components/NotificationCenter';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import { Sparkles, Truck } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    viewMode,
    setIsAdvisorOpen,
    activeOrderForTracking,
    setActiveOrderForTracking,
    orders,
  } = useApp();

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Top Main Navigation */}
      <Navbar />

      {/* Main Viewport */}
      <main className="flex-1">
        {viewMode === 'home' && (
          <>
            <HeroBanner />
            <ProductGrid />
          </>
        )}

        {viewMode === 'catalog' && <ProductGrid />}

        {viewMode === 'orders' && <OrderHistoryView />}

        {viewMode === 'analytics' && <PersonalizedAnalytics />}

        {viewMode === 'seller' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Z-Genie AI Button */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2.5">
        {/* Floating Tracking Shortcut if an active order exists */}
        {orders.length > 0 && orders[0].status !== 'Delivered' && (
          <button
            id="floating-track-btn"
            onClick={() => setActiveOrderForTracking(orders[0])}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold shadow-xl border border-slate-700 hover:scale-105 transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <Truck size={15} className="text-amber-400" />
            <span>Order #{orders[0].id.slice(-5)} In Transit</span>
          </button>
        )}

        {/* AI Assistant Button */}
        <button
          id="floating-ai-advisor-btn"
          onClick={() => setIsAdvisorOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white font-black text-xs shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all group cursor-pointer border-2 border-white/20"
        >
          <Sparkles size={18} className="text-yellow-300 animate-spin-slow group-hover:rotate-45 transition-transform" />
          <span>Ask Z-Genie AI</span>
        </button>
      </div>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <LiveTrackingModal />
      <AIAdvisorDrawer />
      <NotificationCenter />
      <AuthModal />
    </div>
  );
};

export default function Page() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
