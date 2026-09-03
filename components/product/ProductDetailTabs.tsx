'use client';

import React from 'react';
import { Product } from '@/types/ecommerce';
import { Sparkles, Loader2, Send } from 'lucide-react';

interface ProductDetailTabsProps {
  product: Product;
  activeTab: 'details' | 'ai_summary' | 'ask_ai';
  setActiveTab: (tab: 'details' | 'ai_summary' | 'ask_ai') => void;
  aiSummary: string;
  isGeneratingSummary: boolean;
  generateAiReviewSummary: () => void;
  userQuestion: string;
  setUserQuestion: (q: string) => void;
  isAskingAi: boolean;
  aiAnswer: string;
  handleAskAi: (e: React.FormEvent) => void;
}

const ProductDetailsPanel: React.FC<{ product: Product }> = ({ product }) => (
  <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
    <p className="leading-relaxed">{product.description}</p>
    {product.specifications && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
        {Object.entries(product.specifications).map(([key, val]) => (
          <div
            key={key}
            className="p-2 rounded bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-800 flex justify-between"
          >
            <span className="font-bold text-gray-600 dark:text-gray-400">{key}:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{val}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ProductAiSummaryPanel: React.FC<{
  aiSummary: string;
  isGeneratingSummary: boolean;
}> = ({ aiSummary, isGeneratingSummary }) => (
  <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700 space-y-2 text-xs">
    <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
      <Sparkles size={16} className="text-amber-500" /> AI-Generated Customer Sentiment Summary
    </div>
    {isGeneratingSummary ? (
      <div className="flex items-center gap-2 text-gray-500 py-4 justify-center">
        <Loader2 size={16} className="animate-spin text-amber-500" /> Analyzing 1,200+ customer reviews...
      </div>
    ) : (
      <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
        {aiSummary}
      </p>
    )}
  </div>
);

const ProductAskAiPanel: React.FC<{
  userQuestion: string;
  setUserQuestion: (q: string) => void;
  isAskingAi: boolean;
  aiAnswer: string;
  handleAskAi: (e: React.FormEvent) => void;
}> = ({ userQuestion, setUserQuestion, isAskingAi, aiAnswer, handleAskAi }) => (
  <div className="space-y-3">
    <form onSubmit={handleAskAi} className="flex gap-2">
      <input
        type="text"
        aria-label="Ask AI a question about this product"
        value={userQuestion}
        onChange={(e) => setUserQuestion(e.target.value)}
        placeholder="e.g. Does this support fast wireless charging?"
        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-gray-100"
      />
      <button
        type="submit"
        disabled={isAskingAi}
        className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
      >
        {isAskingAi ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        <span>Ask</span>
      </button>
    </form>

    {aiAnswer && (
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 text-xs text-gray-800 dark:text-gray-200 font-medium">
        {aiAnswer}
      </div>
    )}
  </div>
);

export const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({
  product,
  activeTab,
  setActiveTab,
  aiSummary,
  isGeneratingSummary,
  generateAiReviewSummary,
  userQuestion,
  setUserQuestion,
  isAskingAi,
  aiAnswer,
  handleAskAi,
}) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'details'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          Product Details
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('ai_summary');
            if (!aiSummary) generateAiReviewSummary();
          }}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'ai_summary'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <Sparkles size={14} className="text-amber-500" /> Gemini AI Insights
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ask_ai')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'ask_ai'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          Ask AI Assistant
        </button>
      </div>

      {activeTab === 'details' && <ProductDetailsPanel product={product} />}
      {activeTab === 'ai_summary' && (
        <ProductAiSummaryPanel
          aiSummary={aiSummary}
          isGeneratingSummary={isGeneratingSummary}
        />
      )}
      {activeTab === 'ask_ai' && (
        <ProductAskAiPanel
          userQuestion={userQuestion}
          setUserQuestion={setUserQuestion}
          isAskingAi={isAskingAi}
          aiAnswer={aiAnswer}
          handleAskAi={handleAskAi}
        />
      )}
    </div>
  );
};
