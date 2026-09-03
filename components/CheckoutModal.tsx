'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { X } from 'lucide-react';
import { useCheckoutWizard } from '@/hooks/useCheckoutWizard';

import { CheckoutStepper } from './checkout/CheckoutStepper';
import { CheckoutAddressStep } from './checkout/CheckoutAddressStep';
import { CheckoutShippingStep } from './checkout/CheckoutShippingStep';
import { CheckoutPaymentStep } from './checkout/CheckoutPaymentStep';
import { Checkout2FAStep } from './checkout/Checkout2FAStep';
import { CheckoutSuccessStep } from './checkout/CheckoutSuccessStep';

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
    placeOrder,
    formatPrice,
    setActiveOrderForTracking,
    playChimeSound,
    verify2FACode,
  } = useApp();

  const wizard = useCheckoutWizard(user, placeOrder, playChimeSound, verify2FACode);

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
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
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Close Checkout"
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Wizard Stepper */}
        <CheckoutStepper step={wizard.step} />

        {/* Step Content */}
        <div className="p-6">
          {wizard.step === 'address' && (
            <CheckoutAddressStep
              user={user}
              selectedAddressId={wizard.selectedAddressId}
              setSelectedAddressId={wizard.setSelectedAddressId}
              isAddingNewAddress={wizard.isAddingNewAddress}
              setIsAddingNewAddress={wizard.setIsAddingNewAddress}
              newAddress={wizard.newAddress}
              setNewAddress={wizard.setNewAddress}
              onNext={wizard.handleNextFromAddress}
            />
          )}

          {wizard.step === 'shipping' && (
            <CheckoutShippingStep
              shippingSpeed={wizard.shippingSpeed}
              setShippingSpeed={wizard.setShippingSpeed}
              onBack={() => wizard.setStep('address')}
              onNext={wizard.handleNextFromShipping}
            />
          )}

          {wizard.step === 'payment' && (
            <CheckoutPaymentStep
              paymentMethod={wizard.paymentMethod}
              setPaymentMethod={wizard.setPaymentMethod}
              user={user}
              cart={cart}
              cartSubtotal={cartSubtotal}
              cartDiscount={cartDiscount}
              cartShipping={cartShipping}
              cartTax={cartTax}
              cartTotal={cartTotal}
              formatPrice={formatPrice}
              isSubmitting={wizard.isSubmitting}
              onBack={() => wizard.setStep('shipping')}
              onNext={wizard.handleNextFromPayment}
            />
          )}

          {wizard.step === '2fa' && (
            <Checkout2FAStep
              twoFactorCode={wizard.twoFactorCode}
              setTwoFactorCode={wizard.setTwoFactorCode}
              twoFactorError={wizard.twoFactorError}
              isSubmitting={wizard.isSubmitting}
              onBack={() => wizard.setStep('payment')}
              onVerify={wizard.handleVerify2FAAndPlace}
            />
          )}

          {wizard.step === 'success' && wizard.createdOrder && (
            <CheckoutSuccessStep
              user={user}
              createdOrder={wizard.createdOrder}
              formatPrice={formatPrice}
              onClose={() => setIsCheckoutOpen(false)}
              onTrack={setActiveOrderForTracking}
            />
          )}
        </div>
      </div>
    </div>
  );
};
