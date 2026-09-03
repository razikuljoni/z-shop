'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Order } from '@/types/ecommerce';
import {
  Package,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  ExternalLink,
  Receipt,
  Printer,
  ChevronRight,
  Search,
} from 'lucide-react';
import Image from 'next/image';

export const OrderHistoryView: React.FC = () => {
  const {
    orders,
    formatPrice,
    setActiveOrderForTracking,
    addToCart,
    products,
    setViewMode,
    t,
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered'>('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter !== 'All' && order.status !== selectedFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(q);
      const matchesItems = order.items.some((i) => i.product.title.toLowerCase().includes(q));
      if (!matchesId && !matchesItems) return false;
    }
    return true;
  });

  const handleBuyAgain = (productId: string) => {
    const p = products.find((prod) => prod.id === productId);
    if (p) {
      addToCart(p, undefined, 1);
      alert(`Added "${p.title}" to cart.`);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <CheckCircle2 size={13} /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Truck size={13} /> Out for Delivery
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Clock size={13} /> Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Your Orders & Returns
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track parcels, download printable invoices, or buy your favorite items again in 1-click.
          </p>
        </div>

        {/* Search Orders */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="Search orders or items..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['All', 'Delivered', 'Shipped', 'Processing', 'Pending'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedFilter === filter
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-800 hover:bg-gray-50'
            }`}
          >
            {filter} Orders
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-slate-800 space-y-3">
          <div className="w-16 h-16 bg-amber-50 dark:bg-slate-800 text-amber-500 rounded-full flex items-center justify-center mx-auto">
            <Package size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            No orders found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Explore today&apos;s lightning deals and best-selling electronics in the catalog.
          </p>
          <button
            onClick={() => setViewMode('catalog')}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm transition-colors"
          >
            Explore Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              {/* Order Header Meta */}
              <div className="bg-gray-100 dark:bg-slate-800 px-6 py-3.5 border-b border-gray-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Order Placed</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{order.placedAt}</span>
                  </div>

                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Total</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(order.total)}</span>
                  </div>

                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Ship To</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[140px] block">
                      {order.shippingAddress.fullName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-gray-600 dark:text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Order #</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{order.id}</span>
                  </div>

                  <button
                    onClick={() => setSelectedInvoiceOrder(order)}
                    className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-bold cursor-pointer"
                  >
                    <Receipt size={14} /> View Invoice
                  </button>
                </div>
              </div>

              {/* Order Items Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Estimated: {order.estimatedDelivery}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveOrderForTracking(order)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Truck size={14} />
                    <span>Track Package</span>
                  </button>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-slate-700 shrink-0">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.title}
                            fill
                            className="object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                            {item.product.title}
                          </h4>
                          {item.selectedVariant?.name && (
                            <div className="text-xs text-gray-400">Variant: {item.selectedVariant.name}</div>
                          )}
                          <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-0.5">
                            Qty: {item.quantity} • {formatPrice(item.product.price)} each
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleBuyAgain(item.productId)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-slate-950 font-bold text-xs text-gray-800 dark:text-gray-200 transition-colors flex items-center gap-1"
                        >
                          <RotateCcw size={13} />
                          <span>Buy Again</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal Overlay */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 space-y-4 border border-gray-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt size={20} className="text-amber-500" />
                <h3 className="font-black text-base text-gray-900 dark:text-gray-100">
                  Official Order Receipt
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold text-gray-500 block">Sold & Shipped by:</span>
                  <span className="font-black text-gray-900 dark:text-gray-100">Z Shop Global LLC</span>
                  <div className="text-gray-400">410 Terry Ave N, Seattle, WA 98109</div>
                </div>
                <div>
                  <span className="font-bold text-gray-500 block">Billed & Shipped to:</span>
                  <span className="font-black text-gray-900 dark:text-gray-100">{selectedInvoiceOrder.shippingAddress.fullName}</span>
                  <div className="text-gray-400">{selectedInvoiceOrder.shippingAddress.addressLine1}, {selectedInvoiceOrder.shippingAddress.city}</div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-800 pt-3">
                <div className="font-bold mb-2">Itemized Summary</div>
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {selectedInvoiceOrder.items.map((i, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between">
                      <span>{i.product.title} (x{i.quantity})</span>
                      <span className="font-bold">{formatPrice(i.product.price * i.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-800 pt-2 space-y-1 text-right">
                <div>Subtotal: {formatPrice(selectedInvoiceOrder.subtotal)}</div>
                {selectedInvoiceOrder.discount > 0 && <div className="text-emerald-600">Discount: -{formatPrice(selectedInvoiceOrder.discount)}</div>}
                <div>Shipping: {formatPrice(selectedInvoiceOrder.shippingCost)}</div>
                <div>Tax: {formatPrice(selectedInvoiceOrder.tax)}</div>
                <div className="text-base font-black text-gray-900 dark:text-gray-100 pt-1">
                  Grand Total: {formatPrice(selectedInvoiceOrder.total)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-lg flex items-center gap-1.5"
              >
                <Printer size={14} /> Print Invoice
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
