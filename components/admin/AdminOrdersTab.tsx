'use client';

import React from 'react';
import { Order } from '@/types/ecommerce';

interface AdminOrdersTabProps {
  orders: Order[];
  formatPrice: (amount: number) => string;
  updateOrderStatusByAdmin: (orderId: string, newStatus: Order['status']) => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  formatPrice,
  updateOrderStatusByAdmin,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer & Address</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Fulfillment Status</th>
              <th className="px-4 py-3 text-right">Advance Pipeline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-gray-100">
                  {order.id}
                  <div className="text-[10px] text-gray-400 font-sans">{order.placedAt}</div>
                </td>

                <td className="px-4 py-3">
                  <div className="font-bold text-gray-900 dark:text-gray-100">{order.shippingAddress.fullName}</div>
                  <div className="text-[11px] text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.state}</div>
                </td>

                <td className="px-4 py-3">
                  <div className="text-gray-800 dark:text-gray-200 font-semibold">
                    {order.items.length} item(s)
                  </div>
                  <div className="text-[10px] text-gray-400 truncate max-w-xs">
                    {order.items.map((i) => i.product.title).join(', ')}
                  </div>
                </td>

                <td className="px-4 py-3 font-black text-gray-900 dark:text-gray-100">
                  {formatPrice(order.total)}
                </td>

                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {order.paymentMethod}
                </td>

                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatusByAdmin(order.id, e.target.value as any)}
                    aria-label={`Update status for order ${order.id}`}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 cursor-pointer"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      const nextStatus: Record<string, Order['status']> = {
                        'Order Placed': 'Processing',
                        'Processing': 'Shipped',
                        'Shipped': 'Out for Delivery',
                        'Out for Delivery': 'Delivered',
                        'Delivered': 'Delivered',
                      };
                      updateOrderStatusByAdmin(order.id, nextStatus[order.status] || 'Processing');
                    }}
                    className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    Next Step →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
