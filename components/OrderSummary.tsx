/**
 * Order Summary Component
 */

'use client';

import { formatCurrency } from '@/lib/currency';
import { useAppSelector } from '@/store/hooks';
import { selectCartItems, selectCartTotal } from '@/store/slices/cartSlice';
import { selectCurrentCurrency } from '@/store/slices/currencySlice';

interface OrderSummaryProps {
  discount?: number;
  shipping?: number;
  tax?: number;
}

export default function OrderSummary({
  discount = 0,
  shipping = 0,
  tax = 0,
}: OrderSummaryProps) {
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const currentCurrency = useAppSelector(selectCurrentCurrency);

  const subtotal = cartTotal;
  const total = subtotal - discount + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal, currentCurrency)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatCurrency(discount, currentCurrency)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>
            {shipping > 0
              ? formatCurrency(shipping, currentCurrency)
              : 'Free'}
          </span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax</span>
            <span>{formatCurrency(tax, currentCurrency)}</span>
          </div>
        )}
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(total, currentCurrency)}</span>
        </div>
      </div>
    </div>
  );
}

