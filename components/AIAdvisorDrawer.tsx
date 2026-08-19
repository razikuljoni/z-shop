'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User as UserIcon,
  ShoppingBag,
  Zap,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendedProductIds?: string[];
  timestamp: string;
}

const INITIAL_PROMPTS = [
  '🎧 Compare top noise cancelling headphones',
  '🖥️ What is the best OLED monitor for coding & gaming?',
  '🎁 Find premium gifts under $100',
  '☕ Help me choose an espresso machine',
];

let msgCounter = 0;
const getNextMsgId = (prefix: string) => {
  msgCounter += 1;
  return `${prefix}-${msgCounter}`;
};

export const AIAdvisorDrawer: React.FC = () => {
  const {
    isAdvisorOpen,
    setIsAdvisorOpen,
    products,
    user,
    cart,
    setActiveProductDetail,
    formatPrice,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello ${user.name.split(' ')[0]}! I am **Z-Genie**, your AI shopping concierge. I can compare technical specs, hunt for deals, or recommend gear tailored to your preferences. What can I help you find today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isAdvisorOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: getNextMsgId('user'),
      sender: 'user',
      text: query,
      timestamp: timestampStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'general_advisor',
          query,
          products,
          userContext: {
            name: user.name,
            cartItemCount: cart.length,
            viewedProductIds: user.viewedProductIds,
          },
        }),
      });

      const data = await response.json();

      // Find any matched products mentioned in catalog
      const matchedIds = products
        .filter((p) => data.text.toLowerCase().includes(p.brand.toLowerCase()) || data.text.toLowerCase().includes(p.title.toLowerCase()))
        .map((p) => p.id)
        .slice(0, 2);

      const aiMsg: ChatMessage = {
        id: getNextMsgId('ai'),
        sender: 'ai',
        text: data.text,
        recommendedProductIds: matchedIds.length > 0 ? matchedIds : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: getNextMsgId('ai-fallback'),
        sender: 'ai',
        text: 'Based on our current catalog, the **AuraPods Max Pro** ($349.99) and **Apex Pro 32" OLED 4K Display** ($899.99) are top-rated for acoustic immersion and ultra-crisp visuals with next-day Prime shipping.',
        recommendedProductIds: [products[0]?.id, products[1]?.id].filter(Boolean),
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 dark:border-slate-800 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-900 to-indigo-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles size={18} className="fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight">Z-Genie AI Shopping Assistant</h2>
              <div className="text-[10px] text-purple-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Powered by Gemini 3.7 Flash</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAdvisorOpen(false)}
            className="p-1.5 rounded-full text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Stage */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot size={15} />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-200 dark:border-slate-700 leading-relaxed'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Inline Product Cards */}
                {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                    <div className="font-bold text-[11px] text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
                      <ShoppingBag size={12} /> Suggested Products:
                    </div>
                    {msg.recommendedProductIds.map((pid) => {
                      const prod = products.find((p) => p.id === pid);
                      if (!prod) return null;
                      return (
                        <div
                          key={prod.id}
                          onClick={() => {
                            setActiveProductDetail(prod);
                            setIsAdvisorOpen(false);
                          }}
                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:border-amber-400 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="relative w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded p-1 shrink-0">
                              <Image src={prod.images[0]} alt="" fill className="object-contain" referrerPolicy="no-referrer" />
                            </div>
                            <div className="truncate">
                              <div className="font-bold text-gray-900 dark:text-gray-100 truncate">{prod.title}</div>
                              <div className="text-amber-600 dark:text-amber-400 font-black">{formatPrice(prod.price)}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:underline shrink-0">
                            View →
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className={`text-[9px] ${msg.sender === 'user' ? 'text-slate-800' : 'text-gray-400'} text-right`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <UserIcon size={14} />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-gray-400">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Loader2 size={14} className="animate-spin" />
              </div>
              <span className="text-xs italic">Z-Genie is reviewing catalog specs & recommendations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-850 flex gap-1.5 overflow-x-auto no-scrollbar">
          {INITIAL_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[11px] font-medium text-gray-700 dark:text-gray-300 hover:bg-amber-50 hover:border-amber-400 transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask Z-Genie for recommendations, comparisons, or gifts..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
};
