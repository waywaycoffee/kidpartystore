/**
 * Abandoned Carts Management Page
 */

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface AbandonedCart {
  id: string;
  email?: string;
  userId?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  itemCount: number;
  lastActivityAt: string;
  reminderSent: boolean;
}

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbandonedCarts();
  }, []);

  const fetchAbandonedCarts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/carts/abandoned');
      if (res.ok) {
        const data = await res.json();
        setCarts(data.carts || []);
      }
    } catch (error) {
      toast.error('Failed to load abandoned carts');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (cartId: string) => {
    try {
      const res = await fetch('/api/admin/carts/abandoned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, action: 'send_reminder' }),
      });

      if (res.ok) {
        toast.success('Reminder email sent');
        fetchAbandonedCarts();
      } else {
        toast.error('Failed to send reminder');
      }
    } catch (error) {
      toast.error('Failed to send reminder');
    }
  };

  const handleMarkRecovered = async (cartId: string) => {
    try {
      const res = await fetch('/api/admin/carts/abandoned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, action: 'mark_recovered' }),
      });

      if (res.ok) {
        toast.success('Cart marked as recovered');
        fetchAbandonedCarts();
      } else {
        toast.error('Failed to mark cart as recovered');
      }
    } catch (error) {
      toast.error('Failed to mark cart as recovered');
    }
  };

  const getTimeSinceAbandoned = (lastActivity: string) => {
    const now = new Date().getTime();
    const last = new Date(lastActivity).getTime();
    const hours = Math.floor((now - last) / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day(s) ago`;
    }
    return `${hours} hour(s) ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Abandoned Carts</h1>
        <button
          onClick={fetchAbandonedCarts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {carts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No abandoned carts found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Abandoned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reminder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {carts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{cart.email || 'Guest'}</div>
                      <div className="text-xs text-gray-500">{cart.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {cart.itemCount} item(s)
                      </div>
                      <div className="text-xs text-gray-500">
                        {cart.items[0]?.name}
                        {cart.items.length > 1 && ` +${cart.items.length - 1} more`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${cart.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {getTimeSinceAbandoned(cart.lastActivityAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cart.reminderSent ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Sent
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Not Sent
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {cart.email && !cart.reminderSent && (
                        <button
                          onClick={() => handleSendReminder(cart.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Send Reminder
                        </button>
                      )}
                      <button
                        onClick={() => handleMarkRecovered(cart.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Mark Recovered
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-sm text-gray-600">
          Total: {carts.length} abandoned cart(s)
        </div>
      </div>
    </div>
  );
}

