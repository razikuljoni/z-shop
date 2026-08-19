'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ChevronUp, Globe, ShieldCheck, Truck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setViewMode, setSelectedCategory, language, currency } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#232f3e] text-white border-t border-slate-700 mt-12 select-none">
      {/* Back to Top */}
      <button
        id="back-to-top-btn"
        onClick={scrollToTop}
        className="w-full py-3.5 bg-[#37475a] hover:bg-[#485769] text-xs font-bold text-center transition-colors flex items-center justify-center gap-1 cursor-pointer"
      >
        <ChevronUp size={16} />
        <span>Back to top</span>
      </button>

      {/* 4-Column Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
        {/* Col 1 */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-sm text-white">Get to Know Us</h4>
          <ul className="space-y-1.5 text-gray-300">
            <li>
              <button onClick={() => setViewMode('home')} className="hover:underline">
                About Z Shop Global
              </button>
            </li>
            <li className="hover:underline cursor-pointer">Careers & Engineering</li>
            <li className="hover:underline cursor-pointer">Sustainability & Net Zero</li>
            <li className="hover:underline cursor-pointer">Investor Relations</li>
            <li className="hover:underline cursor-pointer">Z Shop Science & AI Labs</li>
          </ul>
        </div>

        {/* Col 2 */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-sm text-white">Make Money with Us</h4>
          <ul className="space-y-1.5 text-gray-300">
            <li>
              <button onClick={() => setViewMode('seller')} className="hover:underline text-amber-400 font-bold">
                Sell products on Z Shop
              </button>
            </li>
            <li className="hover:underline cursor-pointer">Fulfillment by Z-Prime (FBZ)</li>
            <li className="hover:underline cursor-pointer">Become an Affiliate Partner</li>
            <li className="hover:underline cursor-pointer">Advertise Your Products</li>
            <li className="hover:underline cursor-pointer">Self-Publish with Us</li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-sm text-white">Payment & Protection</h4>
          <ul className="space-y-1.5 text-gray-300">
            <li className="hover:underline cursor-pointer">Z Shop Prime Visa Card</li>
            <li className="hover:underline cursor-pointer">Shop with Reward Points</li>
            <li className="hover:underline cursor-pointer">Reload Your Z-Pay Balance</li>
            <li className="hover:underline cursor-pointer">Two-Factor Security (2FA)</li>
            <li className="hover:underline cursor-pointer">Currency Converter</li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-sm text-white">Let Us Help You</h4>
          <ul className="space-y-1.5 text-gray-300">
            <li>
              <button onClick={() => setViewMode('orders')} className="hover:underline font-bold text-amber-400">
                Your Orders & Tracking
              </button>
            </li>
            <li className="hover:underline cursor-pointer">Shipping Rates & Policies</li>
            <li className="hover:underline cursor-pointer">Returns & Replacements</li>
            <li className="hover:underline cursor-pointer">Manage Your Prime Membership</li>
            <li className="hover:underline cursor-pointer">Customer Service & 24/7 Help</li>
          </ul>
        </div>
      </div>

      {/* Mid Branding Bar */}
      <div className="border-t border-slate-700 py-6 bg-[#131921]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Logo */}
          <div className="flex items-center gap-1.5 font-black text-xl">
            <span className="text-white">Z</span>
            <span className="text-amber-400">SHOP</span>
          </div>

          {/* Quick Badges */}
          <div className="flex items-center gap-4 text-gray-300 text-xs">
            <div className="flex items-center gap-1.5">
              <Globe size={14} className="text-amber-400" />
              <span>{language.toUpperCase()} • {currency}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>256-bit Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-blue-400" />
              <span>Z-Prime Global</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#0f141b] py-4 text-center text-[11px] text-gray-400 border-t border-slate-800">
        <div className="space-x-4 mb-1">
          <span className="hover:underline cursor-pointer">Conditions of Use</span>
          <span className="hover:underline cursor-pointer">Privacy Notice</span>
          <span className="hover:underline cursor-pointer">Consumer Health Data</span>
          <span className="hover:underline cursor-pointer">Your Ads Privacy Choices</span>
        </div>
        <div>
          © 2026, Z Shop, Inc. or its affiliates. Designed with precision for global e-commerce.
        </div>
      </div>
    </footer>
  );
};
