/**
 * Order Detail Page
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  email: string;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  shippingMethod?: {
    id: string;
    name: string;
    days: number;
    cost: number;
  };
  paymentMethod?: {
    type: string;
    last4?: string;
  };
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
  couponCode?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  createdAt: string;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <Link href="/account/orders" className="btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/account/orders"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Orders
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Order Details</h1>

          {/* Order Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order #:</span>
                <span className="ml-2 font-semibold">{order.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Order Status:</span>
                <span className="ml-2 font-semibold">{order.status}</span>
              </div>
              <div>
                <span className="text-gray-600">Order Date:</span>
                <span className="ml-2">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              {order.estimatedDelivery && (
                <div>
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="ml-2">
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </span>
                </div>
              )}
              {order.trackingNumber && (
                <div className="col-span-2">
                  <span className="text-gray-600">Tracking Number:</span>
                  <span className="ml-2 font-semibold">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 border-b pb-4">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                    <Image
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Unit Price: ${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          {order.shippingAddress && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
              </div>
              {order.shippingMethod && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Shipping Method: {order.shippingMethod.name} ({order.shippingMethod.days} days)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Payment Information */}
          {order.paymentMethod && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="text-sm">
                <p>
                  Payment Method: {order.paymentMethod.type}
                  {order.paymentMethod.last4 && ` (****${order.paymentMethod.last4})`}
                </p>
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Price Breakdown</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.pricing.subtotal.toFixed(2)}</span>
              </div>
              {order.pricing.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${order.pricing.discount.toFixed(2)}</span>
                </div>
              )}
              {order.couponCode && (
                <div className="text-sm text-gray-600">
                  Coupon Code: {order.couponCode}
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {order.pricing.shipping > 0
                    ? `$${order.pricing.shipping.toFixed(2)}`
                    : 'Free'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.pricing.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${order.pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

