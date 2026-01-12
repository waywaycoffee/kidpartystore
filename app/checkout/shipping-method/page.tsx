/**
 * Checkout Step 2: Shipping Method
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCartItems, selectCartTotal } from '@/store/slices/cartSlice';
import { setShippingMethod, setEstimatedDelivery } from '@/store/slices/cartSlice';
import CheckoutSteps from '@/components/CheckoutSteps';
import OrderSummary from '@/components/OrderSummary';
import toast from 'react-hot-toast';

const shippingMethods = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    nameCn: 'Standard Shipping',
    days: 7,
    price: 9.99,
    freeThreshold: 50,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    nameCn: 'Express Shipping',
    days: 3,
    price: 19.99,
    freeThreshold: 100,
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    nameCn: 'Overnight Shipping',
    days: 1,
    price: 39.99,
    freeThreshold: 200,
  },
];

export default function ShippingMethodPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const shippingAddress = useAppSelector((state) => state.user.shippingAddress);

  const [selectedMethod, setSelectedMethod] = useState(shippingMethods[0].id);
  const [shippingCost, setShippingCost] = useState(0);
  const [estimatedDelivery, setEstimatedDeliveryState] = useState('');

  useEffect(() => {
    // If no address info, redirect back to step 1
    if (!shippingAddress?.addressLine1) {
      router.push('/checkout/shipping');
      return;
    }

    // Calculate shipping cost
    calculateShipping();
  }, [selectedMethod, cartTotal]);

  const calculateShipping = async () => {
    try {
      const res = await fetch('/api/checkout/shipping-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: selectedMethod,
          cartTotal,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setShippingCost(data.shippingCost);
        setEstimatedDeliveryState(data.estimatedDelivery);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const method = shippingMethods.find((m) => m.id === selectedMethod);
    if (method) {
      dispatch(setShippingMethod(selectedMethod as any));
      dispatch(setEstimatedDelivery(`${method.days} days`));
    }

    router.push('/checkout/payment');
  };

  const tax = cartTotal * 0.1; // 10% tax

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutSteps currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Method Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold mb-6">Select Shipping Method</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                {shippingMethods.map((method) => {
                  const isFree = cartTotal >= method.freeThreshold;
                  const cost = isFree ? 0 : method.price;
                  const isSelected = selectedMethod === method.id;

                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.id}
                            checked={isSelected}
                            onChange={() => setSelectedMethod(method.id)}
                            className="mr-3"
                          />
                          <div>
                            <h3 className="font-semibold">{method.name}</h3>
                            <p className="text-sm text-gray-600">
                              Estimated {method.days} days delivery
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {isFree ? (
                            <span className="text-green-600 font-semibold">Free</span>
                          ) : (
                            <span className="font-semibold">${method.price.toFixed(2)}</span>
                          )}
                          {!isFree && cartTotal < method.freeThreshold && (
                            <p className="text-xs text-gray-500">
                              Free shipping over ${method.freeThreshold}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary shipping={shippingCost} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}

