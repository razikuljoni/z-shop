'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShippingAddress, Order } from '@/types/ecommerce';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  Lock,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Wallet,
  Smartphone,
  Banknote,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    user,
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    appliedCoupon,
    placeOrder,
    formatPrice,
    setActiveOrderForTracking,
    playChimeSound,
    verify2FACode,
  } = useApp();

  const [step, setStep] = useState<'address' | 'shipping' | 'payment' | '2fa' | 'success'>('address');

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user.addresses[0]?.id || 'addr-1'
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    id: 'addr-new',
    fullName: user.name,
    addressLine1: '',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    country: 'United States',
    phone: user.phoneNumber || '+1 (555) 234-8890',
  });

  // Shipping Speed State
  const [shippingSpeed, setShippingSpeed] = useState<Order['shippingSpeed']>(
    'Prime Free Next-Day'
  );

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Credit Card');
  const [selectedCardId, setSelectedCardId] = useState<string>(user.paymentCards[0]?.id || 'card-1');

  // 2FA Code State
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);

  // Success State
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const currentAddress =
    user.addresses.find((a) => a.id === selectedAddressId) ||
    (isAddingNewAddress ? newAddress : user.addresses[0]);

  const handleNextFromAddress = () => {
    if (isAddingNewAddress && !newAddress.addressLine1) {
      alert('Please enter a valid street address.');
      return;
    }
    setStep('shipping');
  };

  const handleNextFromShipping = () => {
    setStep('payment');
  };

  const handleNextFromPayment = async () => {
    if (user.twoFactorEnabled) {
      setStep('2fa');
    } else {
      await finalizeOrder();
    }
  };

  const handleVerify2FAAndPlace = async () => {
    if (!twoFactorCode.trim()) {
      setTwoFactorError('Please enter the 6-digit authentication code.');
      return;
    }

    const isValid = verify2FACode(twoFactorCode);
    if (!isValid && twoFactorCode !== '123456') {
      setTwoFactorError('Invalid verification code. Try code: 123456');
      return;
    }

    setTwoFactorError(null);
    await finalizeOrder();
  };

  const finalizeOrder = async () => {
    setIsSubmitting(true);
    try {
      const order = await placeOrder(
        currentAddress,
        shippingSpeed,
        paymentMethod,
        user.paymentCards.find((c) => c.id === selectedCardId)?.lastFour || '4242'
      );
      setCreatedOrder(order);
      setStep('success');

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#3b82f6', '#10b981'],
        });
      } catch {}

      playChimeSound('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex items-center font-black text-lg">
              <span className="text-slate-900 dark:text-white">Z</span>
              <span className="text-amber-500">SHOP</span>
            </div>
            <span className="text-gray-400 dark:text-slate-600">•</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Secure 256-Bit Checkout
            </span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Wizard Stepper (Only when not success) */}
        {step !== 'success' && (
          <div className="px-6 py-3 bg-amber-50/70 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step === 'address' ? 'bg-amber-500 text-slate-950' : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'}`}>
                1
              </span>
              <span className={step === 'address' ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}>
                Shipping Address
              </span>
            </div>
            <ChevronRight size={14} className="text-gray-400" />

            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step === 'shipping' ? 'bg-amber-500 text-slate-950' : 'bg-gray-200 dark:bg-slate-700 text-gray-600'}`}>
                2
              </span>
              <span className={step === 'shipping' ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-400'}>
                Delivery Options
              </span>
            </div>
            <ChevronRight size={14} className="text-gray-400" />

            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step === 'payment' || step === '2fa' ? 'bg-amber-500 text-slate-950' : 'bg-gray-200 dark:bg-slate-700 text-gray-600'}`}>
                3
              </span>
              <span className={step === 'payment' || step === '2fa' ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-400'}>
                Payment & 2FA
              </span>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6">
          {/* STEP 1: Address */}
          {step === 'address' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <MapPin size={16} className="text-amber-500" /> Select Delivery Address
                </h3>
                <button
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
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
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
                        <div>{addr.addressLine1} {addr.addressLine2}</div>
                        <div>{addr.city}, {addr.state} {addr.zipCode}</div>
                        <div className="text-gray-400">{addr.phone}</div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-800 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Address Line</label>
                    <input
                      type="text"
                      placeholder="Street address or P.O. Box"
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">City</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">State</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Zip Code</label>
                      <input
                        type="text"
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
                  onClick={handleNextFromAddress}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Delivery Options</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Speed */}
          {step === 'shipping' && (
            <div className="space-y-4">
              <h3 className="font-black text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Truck size={16} className="text-amber-500" /> Choose Your Delivery Speed
              </h3>

              <div className="space-y-3">
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    shippingSpeed === 'Prime Free Next-Day'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                      : 'border-gray-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingSpeed"
                      checked={shippingSpeed === 'Prime Free Next-Day'}
                      onChange={() => setShippingSpeed('Prime Free Next-Day')}
                      className="text-amber-500 focus:ring-0 accent-amber-500"
                    />
                    <div>
                      <div className="font-bold text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <span className="italic font-black text-amber-500">Prime</span>
                        <span>FREE Next-Day Delivery (Tomorrow by 8:00 PM)</span>
                      </div>
                      <div className="text-[11px] text-gray-500">Fastest free option included with your Z-Prime status</div>
                    </div>
                  </div>
                  <span className="font-black text-xs text-emerald-600">FREE</span>
                </label>

                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    shippingSpeed === 'Same-Day Priority'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                      : 'border-gray-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingSpeed"
                      checked={shippingSpeed === 'Same-Day Priority'}
                      onChange={() => setShippingSpeed('Same-Day Priority')}
                      className="text-amber-500 focus:ring-0 accent-amber-500"
                    />
                    <div>
                      <div className="font-bold text-xs text-gray-900 dark:text-gray-100">
                        Priority Same-Day Express (Today by 9:00 PM)
                      </div>
                      <div className="text-[11px] text-gray-500">Guaranteed instant dispatch from local warehouse WA-8</div>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-gray-900 dark:text-gray-100">$4.99</span>
                </label>

                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    shippingSpeed === 'Standard Delivery (2-3 Days)'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                      : 'border-gray-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingSpeed"
                      checked={shippingSpeed === 'Standard Delivery (2-3 Days)'}
                      onChange={() => setShippingSpeed('Standard Delivery (2-3 Days)')}
                      className="text-amber-500 focus:ring-0 accent-amber-500"
                    />
                    <div>
                      <div className="font-bold text-xs text-gray-900 dark:text-gray-100">
                        Standard Ground Delivery (2-3 Business Days)
                      </div>
                      <div className="text-[11px] text-gray-500">Eco-consolidated box packaging</div>
                    </div>
                  </div>
                  <span className="font-black text-xs text-emerald-600">FREE</span>
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep('address')}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>

                <button
                  onClick={handleNextFromShipping}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {step === 'payment' && (
            <div className="space-y-4">
              <h3 className="font-black text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CreditCard size={16} className="text-amber-500" /> Select Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Credit Card Option */}
                <label
                  className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    paymentMethod === 'Credit Card'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                      : 'border-gray-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'Credit Card'}
                        onChange={() => setPaymentMethod('Credit Card')}
                        className="text-amber-500 focus:ring-0 accent-amber-500"
                      />
                      <span className="font-bold text-xs text-gray-900 dark:text-gray-100">Credit / Debit Card</span>
                    </div>
                    <CreditCard size={16} className="text-amber-500" />
                  </div>
                  <div className="text-[11px] text-gray-500 space-y-0.5">
                    <div>Visa ending in <strong>4242</strong></div>
                    <div>Expires: 08/2029 (Alex Mercer)</div>
                  </div>
                </label>

                {/* Z-Pay Wallet */}
                <label
                  className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    paymentMethod === 'Z-Pay Wallet'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                      : 'border-gray-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'Z-Pay Wallet'}
                        onChange={() => setPaymentMethod('Z-Pay Wallet')}
                        className="text-amber-500 focus:ring-0 accent-amber-500"
                      />
                      <span className="font-bold text-xs text-gray-900 dark:text-gray-100">Z-Pay Store Balance</span>
                    </div>
                    <Wallet size={16} className="text-emerald-500" />
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Available Balance: {formatPrice(user.walletBalance)}
                  </div>
                </label>

                {/* Apple Pay */}
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'Apple Pay'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                      : 'border-gray-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'Apple Pay'}
                      onChange={() => setPaymentMethod('Apple Pay')}
                      className="text-amber-500 focus:ring-0 accent-amber-500"
                    />
                    <span className="font-bold text-xs text-gray-900 dark:text-gray-100">Apple Pay / Google Pay</span>
                  </div>
                  <Smartphone size={16} className="text-gray-500" />
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                      : 'border-gray-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="text-amber-500 focus:ring-0 accent-amber-500"
                    />
                    <span className="font-bold text-xs text-gray-900 dark:text-gray-100">Cash on Delivery</span>
                  </div>
                  <Banknote size={16} className="text-gray-500" />
                </label>
              </div>

              {/* Order Breakdown Summary Box */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-gray-900 dark:text-gray-100">Order Summary</div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)}):</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount:</span>
                    <span>-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping & Handling:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Estimated Tax:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(cartTax)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 dark:text-gray-100 pt-1.5 border-t border-gray-200 dark:border-slate-800">
                  <span>Order Total:</span>
                  <span className="text-amber-600 dark:text-amber-400">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep('shipping')}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>

                <button
                  onClick={handleNextFromPayment}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck size={16} />
                  <span>{user.twoFactorEnabled ? 'Proceed to 2FA Verification' : 'Authorize & Place Order'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Two-Factor Authentication (2FA) */}
          {step === '2fa' && (
            <div className="max-w-md mx-auto py-4 text-center space-y-4">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Lock size={26} />
              </div>

              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-gray-100">
                  Two-Factor Authentication
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  High-security verification active for this purchase. Enter the 6-digit code from your Authenticator app or SMS.
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="• • • • • •"
                  className="w-48 text-center py-2.5 px-3 rounded-lg border-2 border-amber-400 text-xl font-mono tracking-widest text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <div className="text-[11px] text-gray-400">
                  Quick Demo Code: <button type="button" onClick={() => setTwoFactorCode('123456')} className="text-amber-500 font-bold hover:underline">123456</button>
                </div>

                {twoFactorError && (
                  <p className="text-xs text-red-500 font-semibold">{twoFactorError}</p>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => setStep('payment')}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerify2FAAndPlace}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying & Placing...' : 'Verify & Place Order'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Order Confirmed Celebration */}
          {step === 'success' && createdOrder && (
            <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                  Order Successfully Placed
                </span>
                <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-2">
                  Thank you for your order, {user.name.split(' ')[0]}!
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  We sent a confirmation email to <strong>{user.email}</strong> with order receipt details.
                </p>
              </div>

              {/* Order Card Receipt */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-gray-200 dark:border-slate-800 pb-2">
                  <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{createdOrder.id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-slate-800 pb-2">
                  <span className="text-gray-600 dark:text-gray-400">Estimated Delivery:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{createdOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-slate-800 pb-2">
                  <span className="text-gray-600 dark:text-gray-400">Ship To:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {createdOrder.shippingAddress.addressLine1}, {createdOrder.shippingAddress.city}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Total Charged:</span>
                  <span className="font-black text-sm text-gray-900 dark:text-gray-100">{formatPrice(createdOrder.total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  id="live-track-order-btn"
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setActiveOrderForTracking(createdOrder);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Truck size={16} />
                  <span>Live Track Package</span>
                </button>

                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold text-xs transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
