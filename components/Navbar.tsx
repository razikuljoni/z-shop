'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { ProductCategory } from '@/types/ecommerce';
import { LANGUAGES, CATEGORIES } from '@/data/mockData';
import {
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Globe,
  User as UserIcon,
  Bell,
  Sparkles,
  LogOut,
  Package,
  Layers,
  Heart,
  Store,
  BarChart3,
  Sun,
  Moon,
} from 'lucide-react';
import { SearchBar } from './navbar/SearchBar';
import { MobileMenuDrawer } from './navbar/MobileMenuDrawer';

export const LanguageMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen }) => {
  const { language, setLanguage, currency, setCurrency, t } = useApp();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-2xl p-4 z-50 text-gray-800 dark:text-gray-100 text-xs space-y-3">
      <div>
        <div className="font-bold text-gray-500 text-[11px] mb-2 uppercase tracking-wider">
          {t('select_language')}
        </div>
        <div className="space-y-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                language === lang.code
                  ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400 font-bold'
                  : 'hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {language === lang.code && <span className="text-amber-500 font-black">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-slate-800 pt-3">
        <div className="font-bold text-gray-500 text-[11px] mb-2 uppercase tracking-wider">
          {t('select_currency')}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {(['USD', 'EUR', 'GBP', 'JPY'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`px-2 py-1 rounded text-center font-bold transition-colors cursor-pointer ${
                currency === curr
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AccountMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, setIsAuthOpen, setViewMode, t } = useApp();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-2xl p-4 z-50 text-gray-800 dark:text-gray-100 text-xs space-y-3">
      <div className="pb-2 border-b border-gray-200 dark:border-slate-800">
        <div className="font-bold text-sm text-gray-900 dark:text-gray-100">{user.name}</div>
        <div className="text-[11px] text-gray-500">{user.email}</div>
      </div>

      <div className="space-y-1">
        <button
          onClick={() => {
            setViewMode('orders');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-left cursor-pointer"
        >
          <Package size={15} className="text-gray-500" />
          <span>{t('your_orders')}</span>
        </button>

        <button
          onClick={() => {
            setViewMode('seller');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-left font-semibold text-amber-600 dark:text-amber-400 cursor-pointer"
        >
          <Store size={15} />
          <span>Seller Central Dashboard</span>
        </button>

        <button
          onClick={() => {
            setViewMode('analytics');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-left cursor-pointer"
        >
          <BarChart3 size={15} className="text-gray-500" />
          <span>Spending & Savings Insights</span>
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-slate-800 pt-2">
        <button
          onClick={() => {
            setIsAuthOpen(true);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-left font-bold cursor-pointer"
        >
          <LogOut size={15} />
          <span>Sign Out / Switch Account</span>
        </button>
      </div>
    </div>
  );
};

export const SubHeaderNav: React.FC = () => {
  const { setSelectedCategory, viewMode, setViewMode, setIsAdvisorOpen } = useApp();

  return (
    <div className="bg-[#232f3e] text-white px-3 sm:px-6 py-1.5 flex items-center justify-between text-xs font-semibold overflow-x-auto whitespace-nowrap">
      <div className="flex items-center gap-3">
        <button
          id="all-departments-btn"
          onClick={() => {
            setViewMode('catalog');
            setSelectedCategory('All');
          }}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-700 text-amber-400 font-bold transition-colors cursor-pointer"
        >
          <Menu size={16} />
          <span>All Departments</span>
        </button>

        <button
          id="electronics-btn"
          onClick={() => {
            setViewMode('catalog');
            setSelectedCategory('Electronics');
          }}
          className="px-2 py-1 rounded hover:bg-slate-700 text-gray-200 transition-colors cursor-pointer"
        >
          Electronics
        </button>

        <button
          id="computers-btn"
          onClick={() => {
            setViewMode('catalog');
            setSelectedCategory('Computers & Tech');
          }}
          className="px-2 py-1 rounded hover:bg-slate-700 text-gray-200 transition-colors hidden sm:inline cursor-pointer"
        >
          Computers & Tech
        </button>

        <button
          id="audio-btn"
          onClick={() => {
            setViewMode('catalog');
            setSelectedCategory('Audio & Headphones');
          }}
          className="px-2 py-1 rounded hover:bg-slate-700 text-gray-200 transition-colors hidden md:inline cursor-pointer"
        >
          Audio & Headphones
        </button>

        <button
          id="home-kitchen-btn"
          onClick={() => {
            setViewMode('catalog');
            setSelectedCategory('Home & Kitchen');
          }}
          className="px-2 py-1 rounded hover:bg-slate-700 text-gray-200 transition-colors hidden lg:inline cursor-pointer"
        >
          Home & Kitchen
        </button>

        <button
          id="ai-advisor-nav-btn"
          onClick={() => setIsAdvisorOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-colors shadow-sm group cursor-pointer"
        >
          <Sparkles size={14} className="text-yellow-300 group-hover:rotate-12 transition-transform" />
          <span>Z-Genie AI</span>
        </button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          id="analytics-nav-btn"
          onClick={() => setViewMode('analytics')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
            viewMode === 'analytics' ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:bg-slate-700 text-gray-200'
          }`}
        >
          <BarChart3 size={14} />
          <span className="hidden sm:inline">Analytics</span>
        </button>

        <button
          id="seller-portal-nav-btn"
          onClick={() => setViewMode('seller')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
            viewMode === 'seller' ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:bg-slate-700 text-amber-300'
          }`}
        >
          <Store size={14} />
          <span>Seller Hub</span>
        </button>
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const {
    user,
    cartCount,
    unreadNotificationCount,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    setIsCartOpen,
    setIsAuthOpen,
    setIsAdvisorOpen,
    setIsNotificationsOpen,
    language,
    currency,
    theme,
    toggleTheme,
    t,
  } = useApp();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const langRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (viewMode !== 'home' && viewMode !== 'catalog') {
      setViewMode('catalog');
    }
  };

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md select-none transition-colors">
      <div className="bg-[#131921] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded hover:bg-slate-800 text-gray-200 transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <button
            id="zshop-logo-btn"
            onClick={() => {
              setViewMode('home');
              setSelectedCategory('All');
              setSearchQuery('');
              setLocalSearch('');
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded border border-transparent hover:border-amber-400 group transition-colors cursor-pointer"
          >
            <div className="flex items-center font-black tracking-tight text-xl sm:text-2xl">
              <span className="text-white">Z</span>
              <span className="text-amber-400 ml-0.5">SHOP</span>
            </div>
            <div className="relative -mt-2">
              <svg className="w-7 h-2.5 text-amber-400 fill-current group-hover:scale-105 transition-transform" viewBox="0 0 100 35">
                <path d="M 5 15 Q 50 35 95 10 Q 75 22 5 15 Z" />
              </svg>
            </div>
          </button>

          <button
            id="deliver-to-btn"
            onClick={() => setIsAuthOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded border border-transparent hover:border-amber-400 text-left transition-colors cursor-pointer"
          >
            <MapPin size={18} className="text-amber-400 shrink-0" />
            <div className="text-xs leading-tight">
              <span className="text-gray-400 block">{t('deliver_to')}</span>
              <span className="font-bold text-white truncate max-w-[110px] block">
                {user.addresses[0]?.city || 'Seattle 98101'}
              </span>
            </div>
          </button>
        </div>

        <SearchBar
          localSearch={localSearch}
          setLocalSearch={setLocalSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleSearchSubmit={handleSearchSubmit}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          t={t}
        />

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="relative" ref={langRef}>
            <button
              id="language-menu-btn"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded border border-transparent hover:border-amber-400 text-xs font-bold transition-colors cursor-pointer"
              title="Change Language and Currency"
            >
              <span className="text-base">{currentLang.flag}</span>
              <span className="hidden sm:inline">{language.toUpperCase()}</span>
              <span className="text-gray-400 text-[10px]">/ {currency}</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>
            <LanguageMenu isOpen={isLangMenuOpen} onClose={() => setIsLangMenuOpen(false)} />
          </div>

          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded border border-transparent hover:border-amber-400 text-gray-300 hover:text-amber-400 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          <button
            id="notifications-btn"
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded border border-transparent hover:border-amber-400 text-gray-300 hover:text-amber-400 transition-colors cursor-pointer"
            title="Notifications & Delivery Alerts"
            aria-label="View Notifications"
          >
            <Bell size={18} />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          <div className="relative" ref={accountRef}>
            <button
              id="account-menu-btn"
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              aria-label="Account and lists menu"
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border border-transparent hover:border-amber-400 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs leading-tight">
                <span className="text-gray-300 block text-[11px]">
                  {t('hello_user')}
                  {user.name.split(' ')[0]}
                </span>
                <span className="font-bold text-white flex items-center gap-1">
                  {t('account_lists')}
                  <ChevronDown size={11} className="text-gray-400" />
                </span>
              </div>
            </button>
            <AccountMenu isOpen={isAccountMenuOpen} onClose={() => setIsAccountMenuOpen(false)} />
          </div>

          <button
            id="orders-nav-btn"
            onClick={() => setViewMode('orders')}
            className="hidden md:block px-2 py-1 rounded border border-transparent hover:border-amber-400 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs leading-tight">
              <span className="text-gray-300 block text-[11px]">Returns</span>
              <span className="font-bold text-white block">& Orders</span>
            </div>
          </button>

          <button
            id="cart-drawer-btn"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-transparent hover:border-amber-400 relative transition-colors group cursor-pointer"
            aria-label="Open Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart size={24} className="text-white group-hover:text-amber-400 transition-colors" />
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-950 font-black text-xs px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-md">
                {cartCount}
              </span>
            </div>
            <span className="hidden sm:inline font-bold text-sm text-white mt-1">{t('cart')}</span>
          </button>
        </div>
      </div>

      <SubHeaderNav />

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        user={user}
        setViewMode={setViewMode}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setIsAdvisorOpen={setIsAdvisorOpen}
      />
    </header>
  );
};
