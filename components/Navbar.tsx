'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ProductCategory, SupportedLanguage, SupportedCurrency } from '@/types/ecommerce';
import {
  Search,
  ShoppingCart,
  MapPin,
  Globe,
  Sun,
  Moon,
  User,
  ShieldCheck,
  Package,
  Bell,
  Sparkles,
  BarChart3,
  Store,
  ChevronDown,
  Menu,
  X,
  Zap,
  Tag,
  Check,
  CreditCard,
  LogOut,
  Flame,
} from 'lucide-react';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Electronics',
  'Computers & Tech',
  'Fashion & Apparel',
  'Home & Kitchen',
  'Audio & Headphones',
  'Gaming & VR',
  'Sports & Outdoors',
];

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English - EN', flag: '🇺🇸' },
  { code: 'es', label: 'Español - ES', flag: '🇪🇸' },
  { code: 'fr', label: 'Français - FR', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch - DE', flag: '🇩🇪' },
  { code: 'ar', label: 'العربية - AR', flag: '🇸🇦' },
  { code: 'ja', label: '日本語 - JA', flag: '🇯🇵' },
  { code: 'hi', label: 'हिन्दी - HI', flag: '🇮🇳' },
];

const CURRENCIES: { code: SupportedCurrency; symbol: string; label: string }[] = [
  { code: 'USD', symbol: '$', label: 'USD - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP - British Pound' },
  { code: 'JPY', symbol: '¥', label: 'JPY - Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD - Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'AUD - Australian Dollar' },
  { code: 'INR', symbol: '₹', label: 'INR - Indian Rupee' },
];

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
    setLanguage,
    currency,
    setCurrency,
    theme,
    toggleTheme,
    t,
    switchUserRole,
  } = useApp();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const langRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
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
      {/* Primary Top Bar (Amazon Deep Slate / Dark Navy) */}
      <div className="bg-[#131921] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded hover:bg-slate-800 text-gray-200 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <button
            id="zshop-logo-btn"
            onClick={() => {
              setViewMode('home');
              setSelectedCategory('All');
              setSearchQuery('');
              setLocalSearch('');
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded border border-transparent hover:border-amber-400 group transition-colors"
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

          {/* Deliver To Pin (Desktop) */}
          <button
            id="deliver-to-btn"
            onClick={() => setIsAuthOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded border border-transparent hover:border-amber-400 text-left transition-colors"
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

        {/* Middle: Rich Search Bar */}
        <form
          id="search-form"
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-3xl flex items-center h-10 rounded-md overflow-hidden bg-white dark:bg-slate-900 border-2 border-amber-400 focus-within:ring-2 focus-within:ring-amber-500 transition-colors shadow-inner"
        >
          {/* Category Dropdown */}
          <div className="relative hidden sm:block bg-gray-100 dark:bg-slate-800 border-r border-gray-300 dark:border-slate-700 h-full">
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value as ProductCategory);
                if (viewMode !== 'home' && viewMode !== 'catalog') setViewMode('catalog');
              }}
              aria-label="Filter by product category"
              className="h-full bg-transparent text-gray-800 dark:text-gray-200 text-xs font-semibold px-3 py-1 pr-6 cursor-pointer focus:outline-none appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800">
                  {cat === 'All' ? t('all_categories') : cat}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-3.5 text-gray-500 pointer-events-none" />
          </div>

          {/* Search Input */}
          <input
            id="search-input"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={t('search_placeholder')}
            className="flex-1 h-full px-3 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 focus:outline-none placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-sm"
          />

          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                setSearchQuery('');
              }}
              className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={16} />
            </button>
          )}

          {/* Search Action Button */}
          <button
            id="search-submit-btn"
            type="submit"
            className="h-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search size={19} />
          </button>
        </form>

        {/* Right Section: Language, Theme, Account, Orders, Cart */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Language & Currency Selector */}
          <div className="relative" ref={langRef}>
            <button
              id="language-menu-btn"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded border border-transparent hover:border-amber-400 text-xs font-bold transition-colors"
              title="Change Language and Currency"
            >
              <span className="text-base">{currentLang.flag}</span>
              <span className="hidden sm:inline">{language.toUpperCase()}</span>
              <span className="text-gray-400 text-[10px]">/ {currency}</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-2xl border border-gray-200 dark:border-slate-700 py-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Select Language
                </div>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors ${
                      language === l.code ? 'font-bold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-slate-700/50' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    {language === l.code && <Check size={14} className="text-amber-500" />}
                  </button>
                ))}

                <div className="my-2 border-t border-gray-200 dark:border-slate-700" />

                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Currency Setting
                </div>
                <div className="grid grid-cols-2 gap-1 px-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`text-left px-2 py-1 text-xs rounded hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors ${
                        currency === c.code ? 'font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-slate-700' : ''
                      }`}
                    >
                      {c.symbol} {c.code}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded border border-transparent hover:border-amber-400 text-gray-300 hover:text-amber-400 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* Push Notifications Bell with Unread Badge */}
          <button
            id="notifications-btn"
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded border border-transparent hover:border-amber-400 text-gray-300 hover:text-amber-400 transition-colors"
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

          {/* Account & Lists Dropdown */}
          <div className="relative" ref={accountRef}>
            <button
              id="account-menu-btn"
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border border-transparent hover:border-amber-400 text-left transition-colors"
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

            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-2xl border border-gray-200 dark:border-slate-700 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 pb-2 border-b border-gray-100 dark:border-slate-700">
                  <div className="font-bold text-sm flex items-center justify-between">
                    <span>{user.name}</span>
                    <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full uppercase">
                      {user.role}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                  {user.isPrimeMember && (
                    <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <span className="italic font-black text-amber-500">Prime</span> Member Active
                    </div>
                  )}
                  {user.twoFactorEnabled && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck size={13} /> {t('security_verified')}
                    </div>
                  )}
                </div>

                <div className="py-2 text-xs">
                  <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Switch Persona / Role
                  </div>
                  <button
                    onClick={() => {
                      switchUserRole('customer');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 hover:bg-amber-50 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <span>🛍️ Customer VIP Profile</span>
                    {user.role === 'customer' && <Check size={14} className="text-amber-500" />}
                  </button>
                  <button
                    onClick={() => {
                      switchUserRole('seller');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 hover:bg-amber-50 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <span>🏬 Seller & Merchant Portal</span>
                    {user.role === 'seller' && <Check size={14} className="text-amber-500" />}
                  </button>

                  <div className="my-2 border-t border-gray-100 dark:border-slate-700" />

                  <button
                    onClick={() => {
                      setViewMode('orders');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 hover:bg-amber-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Package size={14} className="text-gray-400" /> {t('orders')}
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('analytics');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 hover:bg-amber-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <BarChart3 size={14} className="text-gray-400" /> {t('order_analytics')}
                  </button>
                  <button
                    onClick={() => {
                      setIsAuthOpen(true);
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 hover:bg-amber-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <User size={14} className="text-gray-400" /> Manage Account & 2FA
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Returns & Orders Button */}
          <button
            id="orders-nav-btn"
            onClick={() => setViewMode('orders')}
            className="hidden md:block px-2 py-1 rounded border border-transparent hover:border-amber-400 text-left transition-colors"
          >
            <div className="text-xs leading-tight">
              <span className="text-gray-300 block text-[11px]">Returns</span>
              <span className="font-bold text-white block">& Orders</span>
            </div>
          </button>

          {/* Cart Button */}
          <button
            id="cart-drawer-btn"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-transparent hover:border-amber-400 relative transition-colors group"
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

      {/* Sub-Header Navigation Bar (Dark Slate / Amazon subnav) */}
      <div className="bg-[#232f3e] text-white px-3 sm:px-6 py-1.5 flex items-center justify-between text-xs font-medium overflow-x-auto no-scrollbar gap-2 sm:gap-4 border-t border-slate-700">
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* All Departments Button */}
          <button
            id="all-departments-btn"
            onClick={() => {
              setViewMode('catalog');
              setSelectedCategory('All');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-slate-700 font-bold text-white transition-colors"
          >
            <Menu size={16} />
            <span>All Departments</span>
          </button>

          {/* Quick Category Chips */}
          <button
            id="deals-chip-btn"
            onClick={() => {
              setViewMode('catalog');
              setSearchQuery('deal');
            }}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-700 text-amber-400 font-semibold transition-colors"
          >
            <Flame size={14} className="text-amber-400 animate-pulse" />
            <span>{t('deals')}</span>
          </button>

          <button
            id="best-sellers-btn"
            onClick={() => {
              setViewMode('catalog');
              setSelectedCategory('Electronics');
            }}
            className="px-2 py-1 rounded hover:bg-slate-700 text-gray-200 transition-colors hidden sm:inline"
          >
            Electronics
          </button>

          <button
            id="computers-btn"
            onClick={() => {
              setViewMode('catalog');
              setSelectedCategory('Computers & Tech');
            }}
            className="px-2 py-1 rounded hover:bg-slate-700 text-gray-200 transition-colors hidden sm:inline"
          >
            Computers & Tech
          </button>

          <button
            id="audio-btn"
            onClick={() => {
              setViewMode('catalog');
              setSelectedCategory('Audio & Headphones');
            }}
            className="px-2 py-1 rounded hover:bg-slate-700 text-gray-200 transition-colors hidden md:inline"
          >
            Audio & Headphones
          </button>

          <button
            id="home-kitchen-btn"
            onClick={() => {
              setViewMode('catalog');
              setSelectedCategory('Home & Kitchen');
            }}
            className="px-2 py-1 rounded hover:bg-slate-700 text-gray-200 transition-colors hidden lg:inline"
          >
            Home & Kitchen
          </button>

          {/* AI Shopping Assistant (Z-Genie) Trigger */}
          <button
            id="ai-advisor-nav-btn"
            onClick={() => setIsAdvisorOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-colors shadow-sm group"
          >
            <Sparkles size={14} className="text-yellow-300 group-hover:rotate-12 transition-transform" />
            <span>Z-Genie AI</span>
          </button>
        </div>

        {/* Right subnav actions: Analytics & Seller portal */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="analytics-nav-btn"
            onClick={() => setViewMode('analytics')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-colors ${
              viewMode === 'analytics' ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:bg-slate-700 text-gray-200'
            }`}
          >
            <BarChart3 size={14} />
            <span className="hidden sm:inline">Analytics</span>
          </button>

          <button
            id="seller-portal-nav-btn"
            onClick={() => setViewMode('seller')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-colors ${
              viewMode === 'seller' ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:bg-slate-700 text-amber-300'
            }`}
          >
            <Store size={14} />
            <span>Seller Hub</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
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
              className="text-left py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
            >
              🏠 Home
            </button>
            <button
              onClick={() => {
                setViewMode('catalog');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
            >
              📦 Catalog
            </button>
            <button
              onClick={() => {
                setViewMode('orders');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
            >
              🚚 Track Orders
            </button>
            <button
              onClick={() => {
                setViewMode('analytics');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
            >
              📊 Spending Stats
            </button>
            <button
              onClick={() => {
                setViewMode('seller');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300"
            >
              🏬 Seller Dashboard
            </button>
            <button
              onClick={() => {
                setIsAdvisorOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded bg-purple-900/50 hover:bg-purple-800 text-xs font-semibold text-purple-200"
            >
              ✨ Z-Genie AI
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
