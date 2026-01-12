/**
 * Order Tracking Page
 * Shipping tracking management
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface TrackingInfo {
  status: string;
  location?: string;
  estimatedDelivery?: string;
  events: Array<{
    timestamp: string;
    location: string;
    description: string;
  }>;
}

interface Order {
  id: string;
  status: string;
  trackingNumber?: string;
  carrier?: string;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('DHL');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      setOrder(data.order);
      setTrackingNumber(data.order.trackingNumber || '');
      setCarrier(data.order.carrier || 'DHL');

      if (data.order.trackingNumber) {
        fetchTracking(data.order.trackingNumber, data.order.carrier || 'DHL');
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const fetchTracking = async (trackNum: string, carr: string) => {
    try {
      const res = await fetch(`/api/admin/shipping/tracking?trackingNumber=${trackNum}`);
      const data = await res.json();
      setTrackingInfo(data.tracking);
    } catch (error) {
      console.error('Failed to fetch tracking:', error);
    }
  };

  const updateTracking = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch('/api/admin/shipping/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          trackingNumber: trackingNumber.trim(),
          carrier,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Tracking information updated');
        setOrder(data.order);
        setTrackingInfo(data.tracking);
      } else {
        toast.error('Failed to update tracking');
      }
    } catch (error) {
      console.error('Failed to update tracking:', error);
      toast.error('Failed to update tracking');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Tracking</h1>
          <p className="text-gray-600 mt-1">Order #{order.id}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      {/* Update Tracking */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Update Tracking Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracking Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carrier
            </label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DHL">DHL</option>
              <option value="FedEx">FedEx</option>
              <option value="UPS">UPS</option>
              <option value="USPS">USPS</option>
              <option value="ShipBob">ShipBob</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={updateTracking}
              disabled={updating}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update Tracking'}
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Status */}
      {trackingInfo && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Tracking Status</h2>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Status:</span>
              <span className="ml-2 font-semibold text-lg">{trackingInfo.status}</span>
            </div>
            {trackingInfo.location && (
              <div>
                <span className="text-sm text-gray-600">Current Location:</span>
                <span className="ml-2">{trackingInfo.location}</span>
              </div>
            )}
            {trackingInfo.estimatedDelivery && (
              <div>
                <span className="text-sm text-gray-600">Estimated Delivery:</span>
                <span className="ml-2">
                  {new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Tracking Events Timeline */}
            {trackingInfo.events && trackingInfo.events.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
                <div className="space-y-4">
                  {trackingInfo.events.map((event, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full mt-1.5"></div>
                      <div className="ml-4 flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {event.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {event.location} • {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

