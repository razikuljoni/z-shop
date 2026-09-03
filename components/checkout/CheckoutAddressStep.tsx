'use client';

import React from 'react';
import { ShippingAddress, UserProfile } from '@/types/ecommerce';
import { MapPin, ChevronRight } from 'lucide-react';

interface CheckoutAddressStepProps {
  user: UserProfile;
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  isAddingNewAddress: boolean;
  setIsAddingNewAddress: (val: boolean) => void;
  newAddress: ShippingAddress;
  setNewAddress: (addr: ShippingAddress) => void;
  onNext: () => void;
}

export const CheckoutAddressStep: React.FC<CheckoutAddressStepProps> = ({
  user,
  selectedAddressId,
  setSelectedAddressId,
  isAddingNewAddress,
  setIsAddingNewAddress,
  newAddress,
  setNewAddress,
  onNext,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <MapPin size={16} className="text-amber-500" /> Select Delivery Address
        </h3>
        <button
          type="button"
          onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
          className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
        >
          {isAddingNewAddress ? 'Select Saved Address' : '+ Add New Address'}
        </button>
      </div>

      {!isAddingNewAddress ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {user.addresses.map((addr) => (
            <label
              key={addr.id}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                selectedAddressId === addr.id
                  ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                  : 'border-gray-200 dark:border-slate-800 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                  className="mt-1 text-amber-500 focus:ring-0 accent-amber-500"
                />
                {addr.isDefault && (
                  <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                    Default
                  </span>
                )}
              </div>
              <div className="mt-2 text-xs space-y-0.5 text-gray-700 dark:text-gray-300">
                <div className="font-bold text-gray-900 dark:text-gray-100">{addr.fullName}</div>
                <div>
                  {addr.addressLine1} {addr.addressLine2}
                </div>
                <div>
                  {addr.city}, {addr.state} {addr.zipCode}
                </div>
                <div className="text-gray-400">{addr.phone}</div>
              </div>
            </label>
          ))}
        </div>
      ) : (
        <div className="space-y-3 bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-800 text-xs">
          <div>
            <label htmlFor="address-full-name" className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Full Name
            </label>
            <input
              id="address-full-name"
              type="text"
              aria-label="Full Name"
              value={newAddress.fullName}
              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="address-line1" className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Address Line
            </label>
            <input
              id="address-line1"
              type="text"
              aria-label="Address Line"
              placeholder="Street address or P.O. Box"
              value={newAddress.addressLine1}
              onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="address-city" className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                City
              </label>
              <input
                id="address-city"
                type="text"
                aria-label="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label htmlFor="address-state" className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                State
              </label>
              <input
                id="address-state"
                type="text"
                aria-label="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label htmlFor="address-zip" className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Zip Code
              </label>
              <input
                id="address-zip"
                type="text"
                aria-label="Zip Code"
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <span>Continue to Delivery Options</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
