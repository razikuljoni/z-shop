'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  MapPin,
  Wallet,
  X,
  Check,
  Sparkles,
  Plus,
  RefreshCw,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthOpen,
    setIsAuthOpen,
    user,
    setUser,
    formatPrice,
    toggleTwoFactor,
    switchUserRole,
    t,
  } = useApp();

  const [topupSuccess, setTopupSuccess] = useState(false);

  if (!isAuthOpen) return null;

  const handleTopupWallet = () => {
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + 50,
    }));
    setTopupSuccess(true);
    setTimeout(() => setTopupSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 space-y-6 border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-gray-100">
                {user.name}
              </h2>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          </div>

          <button
            onClick={() => setIsAuthOpen(false)}
            aria-label="Close user profile modal"
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Persona Switcher Box */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Switch Persona & Role
            </span>
            <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full uppercase">
              Current: {user.role}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => switchUserRole('customer')}
              className={`p-3 rounded-lg border text-left transition-colors text-xs ${
                user.role === 'customer'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 font-bold text-amber-900 dark:text-amber-200 ring-1 ring-amber-500'
                  : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>🛍️ Alex Mercer</span>
                {user.role === 'customer' && <Check size={14} className="text-amber-500" />}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-normal">Customer & VIP Prime Buyer</div>
            </button>

            <button
              onClick={() => switchUserRole('seller')}
              className={`p-3 rounded-lg border text-left transition-colors text-xs ${
                user.role === 'seller'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 font-bold text-amber-900 dark:text-amber-200 ring-1 ring-amber-500'
                  : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>🏬 Sarah Jenkins</span>
                {user.role === 'seller' && <Check size={14} className="text-amber-500" />}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-normal">Merchant & Catalog Admin</div>
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication 2FA Security Switch */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs ${
              user.twoFactorEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
            }`}>
              {user.twoFactorEnabled ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
            </div>
            <div>
              <div className="font-bold text-xs text-gray-900 dark:text-gray-100">
                Two-Factor Authentication (2FA)
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                {user.twoFactorEnabled ? 'Secured with 6-digit TOTP code at checkout' : 'Disabled (Enable for extra account protection)'}
              </div>
            </div>
          </div>

          <button
            onClick={() => toggleTwoFactor(!user.twoFactorEnabled)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              user.twoFactorEnabled
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200'
            }`}
          >
            {user.twoFactorEnabled ? 'Enabled ✓' : 'Enable 2FA'}
          </button>
        </div>

        {/* Z-Pay Wallet Section */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Wallet size={18} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Z-Pay Store Wallet
              </div>
              <div className="font-black text-base text-gray-900 dark:text-gray-100">
                {formatPrice(user.walletBalance)}
              </div>
            </div>
          </div>

          <button
            onClick={handleTopupWallet}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            {topupSuccess ? <Check size={14} /> : <Plus size={14} />}
            <span>{topupSuccess ? '+$50 Added!' : '+ $50 Recharge'}</span>
          </button>
        </div>

        {/* Saved Addresses List */}
        <div className="space-y-2">
          <div className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
            <MapPin size={14} /> Saved Delivery Addresses ({user.addresses.length})
          </div>
          <div className="space-y-1.5">
            {user.addresses.map((addr) => (
              <div key={addr.id} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">{addr.fullName}</div>
                  <div className="text-gray-500 dark:text-gray-400">{addr.addressLine1}, {addr.city}, {addr.state} {addr.zipCode}</div>
                </div>
                {addr.isDefault && (
                  <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-slate-800">
          <button
            onClick={() => setIsAuthOpen(false)}
            className="px-5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
