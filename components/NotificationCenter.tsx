'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  X,
  CheckCheck,
  Truck,
  Flame,
  ShieldCheck,
  Tag,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    isNotificationsOpen,
    setIsNotificationsOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    triggerPushNotification,
    setActiveOrderForTracking,
    orders,
    t,
  } = useApp();

  if (!isNotificationsOpen) return null;

  const handleTestNotification = () => {
    triggerPushNotification(
      '⚡ Lightning Delivery Update!',
      'Driver Dave Kowalski is now 2 stops away with your Z-Prime package #ZTRK-88921-WA.',
      'delivery'
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'delivery':
      case 'order_status':
        return <Truck size={16} className="text-amber-500" />;
      case 'deal':
        return <Flame size={16} className="text-red-500" />;
      case 'security':
        return <ShieldCheck size={16} className="text-emerald-500" />;
      default:
        return <Bell size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 dark:border-slate-800 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gray-100 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-amber-500" />
            <h2 className="text-sm font-black text-gray-900 dark:text-gray-100">
              Notification & Delivery Feed
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-5 py-2.5 bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400 font-semibold">
            {notifications.filter((n) => !n.read).length} Unread Updates
          </span>

          <button
            onClick={markAllNotificationsAsRead}
            className="text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Bell size={28} className="text-gray-400 dark:text-slate-600 mx-auto" />
              <p className="text-xs text-gray-500 dark:text-gray-400">No notifications at the moment.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (orders.length > 0) {
                    setActiveOrderForTracking(orders[0]);
                    setIsNotificationsOpen(false);
                  }
                }}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer space-y-1 ${
                  !notif.read
                    ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/60 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-750'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-xs shrink-0 border border-gray-200 dark:border-slate-600">
                      {getIcon(notif.type)}
                    </div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">
                      {notif.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 shrink-0">{notif.timestamp}</span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 pl-9 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer with Test Dispatch button */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800 space-y-2">
          <button
            onClick={handleTestNotification}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={15} />
            <span>Simulate Real-Time Push Notification</span>
          </button>
        </div>
      </div>
    </div>
  );
};
