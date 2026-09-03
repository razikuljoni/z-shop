'use client';

import React from 'react';
import { UserProfile } from '@/types/ecommerce';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  user: UserProfile;
  setViewMode: (mode: any) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  setIsAdvisorOpen: (open: boolean) => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  user,
  setViewMode,
  setIsMobileMenuOpen,
  setIsAdvisorOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-slate-900 text-white border-t border-slate-800 px-4 py-3 space-y-2 animate-in slide-in-from-top duration-150">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="font-bold text-sm">Hello, {user.name}</span>
        <span className="text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold uppercase">
          {user.role}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => {
            setViewMode('home');
            setIsMobileMenuOpen(false);
          }}
          className="text-left py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
        >
          🏠 Home
        </button>
        <button
          onClick={() => {
            setViewMode('catalog');
            setIsMobileMenuOpen(false);
          }}
          className="text-left py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
        >
          📦 Catalog
        </button>
        <button
          onClick={() => {
            setViewMode('orders');
            setIsMobileMenuOpen(false);
          }}
          className="text-left py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
        >
          🚚 Track Orders
        </button>
        <button
          onClick={() => {
            setViewMode('analytics');
            setIsMobileMenuOpen(false);
          }}
          className="text-left py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
        >
          📊 Spending Stats
        </button>
        <button
          onClick={() => {
            setViewMode('seller');
            setIsMobileMenuOpen(false);
          }}
          className="text-left py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 cursor-pointer"
        >
          🏬 Seller Dashboard
        </button>
        <button
          onClick={() => {
            setIsAdvisorOpen(true);
            setIsMobileMenuOpen(false);
          }}
          className="text-left py-2 px-3 rounded bg-purple-900/50 hover:bg-purple-800 text-xs font-semibold text-purple-200 cursor-pointer"
        >
          ✨ Z-Genie AI
        </button>
      </div>
    </div>
  );
};
