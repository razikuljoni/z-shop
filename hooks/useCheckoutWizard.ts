'use client';

import { useState } from 'react';
import { ShippingAddress, Order, UserProfile } from '@/types/ecommerce';
import confetti from 'canvas-confetti';

export function useCheckoutWizard(
  user: UserProfile,
  placeOrder: (
    shippingAddress: ShippingAddress,
    shippingSpeed: Order['shippingSpeed'],
    paymentMethod: Order['paymentMethod'],
    cardLastFour?: string
  ) => Promise<Order>,
  playChimeSound: (type?: 'success' | 'alert' | 'notification') => void,
  verify2FACode: (code: string) => boolean
) {
  const [step, setStep] = useState<'address' | 'shipping' | 'payment' | '2fa' | 'success'>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(user.addresses[0]?.id || 'addr-1');
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

  const [shippingSpeed, setShippingSpeed] = useState<Order['shippingSpeed']>('Prime Free Next-Day');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Credit Card');
  const [selectedCardId] = useState<string>(user.paymentCards[0]?.id || 'card-1');

  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentAddress =
    user.addresses.find((a) => a.id === selectedAddressId) || (isAddingNewAddress ? newAddress : user.addresses[0]);

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

  return {
    step,
    setStep,
    selectedAddressId,
    setSelectedAddressId,
    isAddingNewAddress,
    setIsAddingNewAddress,
    newAddress,
    setNewAddress,
    shippingSpeed,
    setShippingSpeed,
    paymentMethod,
    setPaymentMethod,
    twoFactorCode,
    setTwoFactorCode,
    twoFactorError,
    createdOrder,
    isSubmitting,
    handleNextFromAddress,
    handleNextFromShipping,
    handleNextFromPayment,
    handleVerify2FAAndPlace,
  };
}
