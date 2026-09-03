'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ProductCategory } from '@/types/ecommerce';
import { ChevronLeft, ChevronRight, Zap, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  category: ProductCategory;
  bgGradient: string;
  image: string;
  badge: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Up to 35% Off Ultra High-End Audio & ANC Headphones',
    subtitle: 'Experience spatial acoustic perfection with 45-hour battery life & instant Prime shipping.',
    ctaText: 'Shop Audio Deals',
    category: 'Audio & Headphones',
    bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    badge: '⚡ Limited Time Lightning Deal',
  },
  {
    id: 'slide-2',
    title: 'Level Up with 4K OLED 240Hz Gaming Monitors',
    subtitle: 'Ultra-fast 0.03ms response time, quantum dot colors, and zero ghosting.',
    ctaText: 'Explore Gaming Gear',
    category: 'Computers & Tech',
    bgGradient: 'from-zinc-950 via-slate-900 to-amber-950/40',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&auto=format&fit=crop&q=80',
    badge: '🏆 #1 Best Seller in Displays',
  },
  {
    id: 'slide-3',
    title: 'Cinema in Your Pocket: 8K Sub-249g Smart Drones',
    subtitle: 'Omnidirectional obstacle sensing, 46-min flight endurance, and 48MP raw HDR capture.',
    ctaText: 'Discover Drones',
    category: 'Electronics',
    bgGradient: 'from-slate-900 via-sky-950 to-slate-900',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1200&auto=format&fit=crop&q=80',
    badge: '✨ Next-Gen Tech 2026',
  },
];

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, setViewMode, setIsAdvisorOpen } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = SLIDES[currentSlide];

  return (
    <div
      id="hero-carousel-section"
      className="relative w-full overflow-hidden bg-slate-950 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Slide Stage */}
      <div className={`relative min-h-[360px] sm:min-h-[440px] md:min-h-[480px] bg-gradient-to-r ${slide.bgGradient} flex items-center transition-opacity transition-transform duration-700`}>
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 opacity-35 dark:opacity-25 mix-blend-luminosity overflow-hidden">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Gradient Mask to integrate with page */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-transparent to-black/40 dark:from-slate-950 dark:via-transparent dark:to-black/50 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full py-8 md:py-12">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/90 text-slate-950 text-xs font-black uppercase tracking-wide shadow-lg">
              <Zap size={14} className="fill-current" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {slide.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-200 font-medium leading-relaxed drop-shadow max-w-xl">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id={`hero-cta-btn-${slide.id}`}
                onClick={() => {
                  setSelectedCategory(slide.category);
                  setViewMode('catalog');
                }}
                className="px-6 py-2.5 rounded-md bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-xl hover:shadow-2xl transition-colors transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                {slide.ctaText}
              </button>

              <button
                id="hero-ai-genie-btn"
                onClick={() => setIsAdvisorOpen(true)}
                className="px-4 py-2.5 rounded-md bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-semibold text-sm border border-white/20 transition-colors flex items-center gap-1.5"
              >
                <Sparkles size={16} className="text-amber-300" />
                <span>Ask Z-Genie for Advice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors z-20 border border-white/10"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors z-20 border border-white/10"
          aria-label="Next Slide"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Floating 4-Card Amazon Overlap Grid */}
      <div className="relative -mt-16 sm:-mt-24 z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div
            onClick={() => {
              setSelectedCategory('Audio & Headphones');
              setViewMode('catalog');
            }}
            className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-xl border border-gray-200 dark:border-slate-800 hover:shadow-2xl transition-colors cursor-pointer group"
          >
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
              Top Premium Audio
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Noise cancellation & studio sound
            </p>
            <div className="relative h-32 w-full rounded overflow-hidden mb-3 bg-gray-100 dark:bg-slate-800">
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
                alt="Headphones"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
              See more deals →
            </span>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => {
              setSelectedCategory('Computers & Tech');
              setViewMode('catalog');
            }}
            className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-xl border border-gray-200 dark:border-slate-800 hover:shadow-2xl transition-colors cursor-pointer group"
          >
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
              Computers & Displays
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              OLED monitors & mechanical gear
            </p>
            <div className="relative h-32 w-full rounded overflow-hidden mb-3 bg-gray-100 dark:bg-slate-800">
              <Image
                src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80"
                alt="Displays"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
              Upgrade your setup →
            </span>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => {
              setSelectedCategory('Home & Kitchen');
              setViewMode('catalog');
            }}
            className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-xl border border-gray-200 dark:border-slate-800 hover:shadow-2xl transition-colors cursor-pointer group"
          >
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
              Home & Kitchen Favorites
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Espresso machines & air fryers
            </p>
            <div className="relative h-32 w-full rounded overflow-hidden mb-3 bg-gray-100 dark:bg-slate-800">
              <Image
                src="https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=80"
                alt="Home & Kitchen"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
              Explore culinary tech →
            </span>
          </div>

          {/* Card 4: Prime Perks & 1-Day Delivery */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-lg p-4 shadow-xl border border-blue-800/60 hover:shadow-2xl transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 font-black text-lg italic mb-1">
                <Truck size={20} />
                <span>Z-Prime</span>
              </div>
              <h3 className="font-bold text-white text-base mb-1">
                Fast, Free Delivery
              </h3>
              <p className="text-xs text-blue-200 mb-4 leading-relaxed">
                Enjoy guaranteed Next-Day delivery, exclusive lightning deals, and 2FA secure checkout.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-blue-800/80 text-xs">
              <div className="flex items-center gap-2 text-blue-100">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>Zero fraud guarantee with 2FA</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <Truck size={14} className="text-amber-400 shrink-0" />
                <span>Real-time GPS parcel tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
