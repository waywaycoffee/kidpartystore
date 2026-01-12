/**
 * Public Order Tracking Page
 * Customers can track their orders
 */

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface TrackingInfo {
  order: {
    id: string;
    status: string;
    trackingNumber: string;
    carrier: string;
  };
  tracking: {
    status: string;
    location?: string;
    estimatedDelivery?: string;
    events: Array<{
      timestamp: string;
      location: string;
      description: string;
    }>;
  };
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [email, setEmail] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim() && !email.trim()) {
      toast.error('Please enter tracking number or email');
      return;
    }

    setLoading(true);
    try {
      let url = '/api/admin/shipping/tracking?';
      if (trackingNumber.trim()) {
        url += `trackingNumber=${encodeURIComponent(trackingNumber.trim())}`;
      } else if (email.trim()) {
        url += `email=${encodeURIComponent(email.trim())}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        setTrackingInfo(null);
      } else {
        setTrackingInfo(data);
        toast.success('Tracking information found');
      }
    } catch (error) {
      console.error('Failed to fetch tracking:', error);
      toast.error('Failed to fetch tracking information');
      setTrackingInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your tracking number or order email to track your shipment</p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
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
            <div className="text-center text-gray-500">OR</div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter order email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingInfo && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Tracking Information</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-sm text-gray-600">Order #:</span>
                <span className="ml-2 font-semibold">{trackingInfo.order.id}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <span className="ml-2 font-semibold text-lg">{trackingInfo.tracking.status}</span>
              </div>
              {trackingInfo.tracking.location && (
                <div>
                  <span className="text-sm text-gray-600">Current Location:</span>
                  <span className="ml-2">{trackingInfo.tracking.location}</span>
                </div>
              )}
              {trackingInfo.tracking.estimatedDelivery && (
                <div>
                  <span className="text-sm text-gray-600">Estimated Delivery:</span>
                  <span className="ml-2">
                    {new Date(trackingInfo.tracking.estimatedDelivery).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Tracking Timeline */}
            {trackingInfo.tracking.events && trackingInfo.tracking.events.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
                <div className="space-y-4">
                  {trackingInfo.tracking.events.map((event, index) => (
                    <div key={index} className="flex items-start border-l-2 border-blue-200 pl-4">
                      <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full -ml-[9px] mt-1.5"></div>
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
        )}
      </div>
    </div>
  );
}

