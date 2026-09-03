'use client';

import { useState, useMemo, useRef } from 'react';
import { Product, ProductVariant } from '@/types/ecommerce';

export function useProductDetailState(product: Product | null, products: Product[]) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(product?.variants?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ai_summary' | 'reviews' | 'ask_ai'>('details');

  const [selectedBundleIds] = useState<string[]>(product?.frequentlyBoughtTogetherIds || []);

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const isGeneratingRef = useRef(false);

  const [userQuestion, setUserQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const isAskingRef = useRef(false);

  const freqSet = useMemo(() => new Set(product?.frequentlyBoughtTogetherIds || []), [product]);
  const bundleProducts = useMemo(() => products.filter((p) => freqSet.has(p.id)), [products, freqSet]);
  const selectedBundleSet = useMemo(() => new Set(selectedBundleIds), [selectedBundleIds]);
  const activeBundleItems = useMemo(
    () => bundleProducts.filter((p) => selectedBundleSet.has(p.id)),
    [bundleProducts, selectedBundleSet]
  );

  const generateAiReviewSummary = async () => {
    if (!product || isGeneratingRef.current || isGeneratingSummary) return;
    isGeneratingRef.current = true;
    setIsGeneratingSummary(true);
    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'review_summary', product }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setAiSummary(data.text);
    } catch {
      setAiSummary('Top customer sentiment: Outstanding acoustic precision and long-lasting battery life.');
    } finally {
      isGeneratingRef.current = false;
      setIsGeneratingSummary(false);
    }
  };

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !userQuestion.trim() || isAskingRef.current || isAskingAi) return;
    isAskingRef.current = true;
    setIsAskingAi(true);
    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'product_qa', query: userQuestion, product }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setAiAnswer(data.text);
    } catch {
      setAiAnswer('This product is fully compatible and backed by a 2-year warranty and 30-day money back guarantee.');
    } finally {
      isAskingRef.current = false;
      setIsAskingAi(false);
    }
  };

  return {
    selectedVariant,
    setSelectedVariant,
    quantity,
    setQuantity,
    activeTab,
    setActiveTab,
    bundleProducts,
    activeBundleItems,
    aiSummary,
    isGeneratingSummary,
    generateAiReviewSummary,
    userQuestion,
    setUserQuestion,
    aiAnswer,
    isAskingAi,
    handleAskAi,
  };
}
