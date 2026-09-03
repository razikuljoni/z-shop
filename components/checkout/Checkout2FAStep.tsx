'use client';

import React from 'react';
import { Lock } from 'lucide-react';

interface Checkout2FAStepProps {
  twoFactorCode: string;
  setTwoFactorCode: (code: string) => void;
  twoFactorError: string | null;
  isSubmitting: boolean;
  onBack: () => void;
  onVerify: () => void;
}

export const Checkout2FAStep: React.FC<Checkout2FAStepProps> = ({
  twoFactorCode,
  setTwoFactorCode,
  twoFactorError,
  isSubmitting,
  onBack,
  onVerify,
}) => {
  return (
    <div className="max-w-md mx-auto py-4 text-center space-y-4">
      <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <Lock size={26} />
      </div>

      <div>
        <h3 className="text-base font-black text-gray-900 dark:text-gray-100">Two-Factor Authentication</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          High-security verification active for this purchase. Enter the 6-digit code from your Authenticator app or
          SMS.
        </p>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          maxLength={6}
          aria-label="Two-factor authentication 6-digit code"
          value={twoFactorCode}
          onChange={(e) => setTwoFactorCode(e.target.value)}
          placeholder="• • • • • •"
          className="w-48 text-center py-2.5 px-3 rounded-lg border-2 border-amber-400 text-xl font-mono tracking-widest text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <div className="text-[11px] text-gray-400">
          Quick Demo Code:{' '}
          <button
            type="button"
            onClick={() => setTwoFactorCode('123456')}
            className="text-amber-500 font-bold hover:underline"
          >
            123456
          </button>
        </div>

        {twoFactorError && <p className="text-xs text-red-500 font-semibold">{twoFactorError}</p>}
      </div>

      <div className="flex items-center justify-center gap-3 pt-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onVerify}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'Verifying & Placing...' : 'Verify & Place Order'}
        </button>
      </div>
    </div>
  );
};
