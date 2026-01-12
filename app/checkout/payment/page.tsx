/**
 * Checkout Step 3: Payment Information
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from '@/store/slices/cartSlice';
import { setEmail, addOrder } from '@/store/slices/userSlice';
import CheckoutSteps from '@/components/CheckoutSteps';
import OrderSummary from '@/components/OrderSummary';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const shippingAddress = useAppSelector((state) => state.user.shippingAddress);
  const email = useAppSelector((state) => state.user.email);
  const shippingMethod = useAppSelector((state) => state.cart.shippingMethod);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Calculate costs
  const shippingCost = shippingMethod === 'standard' ? 9.99 : shippingMethod === 'express' ? 19.99 : 39.99;
  const isFreeShipping = cartTotal >= 50;
  const finalShipping = isFreeShipping ? 0 : shippingCost;
  const tax = cartTotal * 0.1;
  const total = cartTotal + finalShipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast.error('Please agree to the terms of service');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !expiryMonth || !expiryYear || !cvv) {
        toast.error('Please fill in all payment information');
        return;
      }
    }

    setProcessing(true);

    try {
      const res = await fetch('/api/checkout/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          shippingAddress,
          shippingMethod: {
            id: shippingMethod,
            name: shippingMethod,
            days: shippingMethod === 'standard' ? 7 : shippingMethod === 'express' ? 3 : 1,
            cost: finalShipping,
          },
          paymentMethod: {
            type: paymentMethod,
            last4: cardNumber.slice(-4),
          },
          pricing: {
            subtotal: cartTotal,
            discount: 0,
            shipping: finalShipping,
            tax,
            total,
          },
          email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        dispatch(addOrder(data.orderId));
        dispatch(clearCart());
        toast.success('Payment successful!');
        router.push(`/order-confirmation/${data.orderId}`);
      } else {
        toast.error(data.error || 'Payment failed');
        router.push(`/order-confirmation/${data.orderId}?failed=true`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed, please try again');
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Cart is Empty</h2>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutSteps currentStep={3} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold mb-6">Payment Information</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-4 border-2 rounded-lg ${
                        paymentMethod === 'paypal'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200'
                      }`}
                    >
                      PayPal
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border-2 rounded-lg ${
                        paymentMethod === 'card'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200'
                      }`}
                    >
                      Credit Card
                    </button>
                  </div>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Month <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={expiryMonth}
                          onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                          placeholder="MM"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Year <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={expiryYear}
                          onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="YYYY"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="123"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Details */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Order Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Method:</span>
                      <span>
                        {shippingMethod === 'standard'
                          ? 'Standard Shipping'
                          : shippingMethod === 'express'
                          ? 'Express Shipping'
                          : 'Overnight Shipping'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Delivery:</span>
                      <span>
                        {shippingMethod === 'standard'
                          ? '7 days'
                          : shippingMethod === 'express'
                          ? '3 days'
                          : '1 day'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                    I have read and agree to the{' '}
                    <a href="/terms" className="text-primary-600 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Confirm Payment'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary shipping={finalShipping} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}

