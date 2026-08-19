'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  Package,
  Sparkles,
  Zap,
} from 'lucide-react';
import Image from 'next/image';

export const LiveTrackingModal: React.FC = () => {
  const {
    activeOrderForTracking,
    setActiveOrderForTracking,
    simulateAdvanceOrderStatus,
    formatPrice,
  } = useApp();

  const order = activeOrderForTracking;

  if (!order) return null;

  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'Order Placed':
        return 0;
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const statusIndex = getStatusIndex(order.status);

  const steps = [
    { title: 'Order Placed', desc: 'Verified & Payment Secured', time: 'Today 9:15 AM' },
    { title: 'Processing & Packed', desc: 'Fulfillment Hub WA-8 (Seattle)', time: 'Today 11:30 AM' },
    { title: 'Out for Delivery', desc: 'On electric courier van #402', time: 'Today 1:45 PM' },
    { title: 'Delivered', desc: 'Left in secure parcel locker or porch', time: 'Estimated 3:30 PM' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <Truck size={20} className="text-amber-500" />
            <div>
              <h2 className="text-sm font-black text-gray-900 dark:text-gray-100">
                Live GPS Delivery Radar
              </h2>
              <span className="text-[11px] text-gray-600 dark:text-gray-400 font-mono">
                Tracking ID: {order.trackingNumber || 'ZTRK-88921-WA'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveOrderForTracking(null)}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Animated Map Visualizer Banner */}
          <div className="relative h-48 sm:h-56 w-full rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Grid background simulation */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

            {/* Glowing route line */}
            <div className="absolute w-[80%] h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              {/* Moving Van Marker */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 transition-all duration-700 ${
                  order.status === 'Delivered'
                    ? 'right-0'
                    : order.status === 'Shipped'
                    ? 'left-1/2 -translate-x-1/2 animate-bounce'
                    : 'left-4'
                }`}
              >
                <div className="w-9 h-9 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                  <Truck size={18} />
                </div>
              </div>
            </div>

            {/* Hub Pin (Left) */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg mx-auto">
                <Package size={16} />
              </div>
              <span className="text-[10px] font-bold text-gray-300 block mt-1">WA-8 Hub</span>
            </div>

            {/* Destination Pin (Right) */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg mx-auto ${
                order.status === 'Delivered' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-gray-400 border border-slate-700'
              }`}>
                <MapPin size={16} />
              </div>
              <span className="text-[10px] font-bold text-gray-300 block mt-1">Your Door</span>
            </div>

            {/* Top Status Banner */}
            <div className="absolute top-3 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{order.status === 'Delivered' ? 'Package Delivered' : 'Driver is 4 stops away (28 mins ETA)'}</span>
            </div>
          </div>

          {/* Courier Card */}
          {order.status !== 'Delivered' && (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-base shadow-sm">
                  DK
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span>Dave Kowalski</span>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 px-2 py-0.2 rounded font-bold">
                      4.9★ (840 drops)
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 dark:text-gray-400">
                    Z-Prime Eco Electric Van #402
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Simulated driver call initiated: Connecting to Dave Kowalski...')}
                  className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:text-amber-500 transition-colors"
                  title="Call Courier"
                >
                  <Phone size={16} />
                </button>
                <button
                  onClick={() => alert('Simulated SMS: "Hi Alex, I am on the way with your Z Shop parcel."')}
                  className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:text-amber-500 transition-colors"
                  title="Message Courier"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Timeline Checkpoints */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Delivery Milestones
            </h3>

            <div className="space-y-3 relative pl-6 border-l-2 border-amber-400">
              {steps.map((stepItem, idx) => {
                const isPassed = statusIndex >= idx;
                const isCurrent = statusIndex === idx;

                return (
                  <div key={idx} className="relative space-y-0.5">
                    <div
                      className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isPassed
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-gray-200 dark:bg-slate-800 text-gray-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 size={12} className="stroke-[3]" /> : '•'}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${isCurrent ? 'text-amber-600 dark:text-amber-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {stepItem.title}
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">{stepItem.time}</span>
                    </div>
                    <div className="text-[11px] text-gray-600 dark:text-gray-400">{stepItem.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Preview */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 text-xs space-y-2">
            <div className="font-bold text-gray-900 dark:text-gray-100">Package Contents</div>
            <div className="divide-y divide-gray-200 dark:divide-slate-800">
              {order.items.map((item, i) => (
                <div key={i} className="py-1.5 flex items-center justify-between">
                  <span className="truncate max-w-[280px] text-gray-700 dark:text-gray-300">{item.product.title}</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    Qty: {item.quantity} ({formatPrice(item.product.price * item.quantity)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Demo Simulator Button */}
        <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-gray-600 dark:text-gray-400">
            Interactive Test Hub: Advance order pipeline
          </div>

          <button
            onClick={() => simulateAdvanceOrderStatus(order.id)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap size={14} />
            <span>Simulate Next Delivery Step</span>
          </button>
        </div>
      </div>
    </div>
  );
};
