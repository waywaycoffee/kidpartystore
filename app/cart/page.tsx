/**
 * Shopping Cart Page
 * 
 * Cross-border e-commerce adaptation:
 * - Multi-currency price display
 * - Product quantity adjustment
 * - Shipping cost preview
 * - Continue shopping and checkout buttons
 * 
 * Notes:
 * - Cart data should be read from Redux store
 * - Confirm before removing items
 * - Empty cart should show friendly message
 */

'use client';

import { convertCurrency, formatCurrency } from '@/lib/currency';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  removeFromCart,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from '@/store/slices/cartSlice';
import { selectCurrentCurrency } from '@/store/slices/currencySlice';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { syncCartToServer, recoverCart } from '@/lib/cart-sync';
import { addToCart } from '@/store/slices/cartSlice';

export default function CartPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const currentCurrency = useAppSelector(selectCurrentCurrency);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Recover cart from URL parameter
  useEffect(() => {
    const recoverCartId = searchParams.get('recover');
    if (recoverCartId && cartItems.length === 0) {
      handleRecoverCart(recoverCartId);
    }
  }, [searchParams]);

  // Sync cart to server when items change
  useEffect(() => {
    if (cartItems.length > 0) {
      const syncTimer = setTimeout(() => {
        syncCartToServer({
          items: cartItems,
          total: cartTotal,
          itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        });
      }, 2000); // Debounce: sync 2 seconds after last change

      return () => clearTimeout(syncTimer);
    }
  }, [cartItems, cartTotal]);

  const handleRecoverCart = async (cartId: string) => {
    try {
      const recoveredItems = await recoverCart(cartId);
      if (recoveredItems && recoveredItems.length > 0) {
        recoveredItems.forEach((item) => {
          dispatch(addToCart(item));
        });
        toast.success('Cart recovered successfully!');
        // Remove recover parameter from URL
        router.replace('/cart');
      } else {
        toast.error('Cart not found or already recovered');
      }
    } catch (error) {
      toast.error('Failed to recover cart');
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveItem(id);
      return;
    }
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    try {
      const res = await fetch('/api/cart/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode: couponCode.trim(),
          cartTotal,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAppliedCoupon({
          code: data.couponCode,
          discount: data.discount,
          type: data.type,
        });
        toast.success('Coupon applied successfully!');
        setCouponCode('');
      } else {
        toast.error(data.error || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Start shopping to add items to your cart
          </p>
          <Link href="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, cartTotal - discount);
  const convertedTotal = convertCurrency(cartTotal, 'USD', currentCurrency);
  const convertedDiscount = convertCurrency(discount, 'USD', currentCurrency);
  const convertedFinalTotal = convertCurrency(finalTotal, 'USD', currentCurrency);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const convertedPrice = convertCurrency(
                item.price,
                'USD',
                currentCurrency
              );
              const itemTotal = convertedPrice * item.quantity;

              return (
                <div
                  key={`${item.id}-${item.customization?.value || ''}`}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-4"
                >
                  {/* Product Image */}
                  <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                    {item.theme && (
                      <p className="text-sm text-gray-600 mb-2">
                        Theme: {t(`themes.${item.theme}`) || item.theme}
                      </p>
                    )}
                    {item.customization && (
                      <p className="text-sm text-primary-600 mb-2">
                        Customization: {item.customization.value}
                      </p>
                    )}
                    <div className="text-lg font-bold text-primary-600">
                      {formatCurrency(itemTotal, currentCurrency)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 mb-4"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 border rounded-lg hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 border rounded-lg hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Coupon Code Input */}
              <div className="mb-4">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon Code"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm font-semibold disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-green-700">
                        Coupon: {appliedCoupon.code}
                      </span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-green-600">
                      Discount: {formatCurrency(convertedDiscount, currentCurrency)}
                    </p>
                  </div>
                )}
              </div>

              {/* Shipping Estimate */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  {cartTotal >= 50 ? (
                    <span className="font-semibold">✓ Free shipping eligible</span>
                  ) : (
                    <span>
                      Add ${(50 - cartTotal).toFixed(2)} more for free shipping
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>{t('common.subtotal')}</span>
                  <span>{formatCurrency(convertedTotal, currentCurrency)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(convertedDiscount, currentCurrency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t('common.shipping')}</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('common.total')}</span>
                  <span>
                    {formatCurrency(convertedFinalTotal, currentCurrency)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout/shipping')}
                className="w-full btn-primary mb-4"
              >
                {t('common.checkout')}
              </button>
              <Link
                href="/"
                className="block text-center text-primary-600 hover:text-primary-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

