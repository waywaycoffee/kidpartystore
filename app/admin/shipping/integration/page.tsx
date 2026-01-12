/**
 * Shipping Integration
 * 物流集成管理
 */

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface ShippingProvider {
  id: string;
  name: string;
  apiKey?: string;
  apiSecret?: string;
  enabled: boolean;
  trackingUrl?: string;
}

const defaultProviders: ShippingProvider[] = [
  { id: 'fedex', name: 'FedEx', enabled: false },
  { id: 'ups', name: 'UPS', enabled: false },
  { id: 'dhl', name: 'DHL', enabled: false },
  { id: 'usps', name: 'USPS', enabled: false },
];

export default function ShippingIntegrationPage() {
  const [providers, setProviders] = useState<ShippingProvider[]>(defaultProviders);
  const [loading, setLoading] = useState(true);
  const [editingProvider, setEditingProvider] = useState<ShippingProvider | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/admin/shipping/providers');
      if (res.ok) {
        const data = await res.json();
        if (data.providers && data.providers.length > 0) {
          setProviders(data.providers);
        }
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (provider: ShippingProvider) => {
    try {
      const res = await fetch(`/api/admin/shipping/providers/${provider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(provider),
      });

      if (res.ok) {
        toast.success('Provider updated');
        setEditingProvider(null);
        fetchProviders();
      } else {
        toast.error('Failed to update provider');
      }
    } catch (error) {
      console.error('Error saving provider:', error);
      toast.error('Failed to save provider');
    }
  };

  const handleTestConnection = async (providerId: string) => {
    try {
      const res = await fetch(`/api/admin/shipping/providers/${providerId}/test`, {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Connection test successful');
      } else {
        toast.error('Connection test failed');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error('Connection test failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Shipping Integration</h1>
        <p className="text-gray-600 mt-2">Configure shipping provider APIs for automatic tracking</p>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => (
          <div key={provider.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{provider.name}</h3>
                <p className="text-sm text-gray-500">
                  {provider.enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTestConnection(provider.id)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 text-sm"
                >
                  Test Connection
                </button>
                <button
                  onClick={() => setEditingProvider(provider)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 text-sm"
                >
                  Configure
                </button>
              </div>
            </div>

            {provider.apiKey && (
              <div className="text-sm text-gray-600">
                API Key: {provider.apiKey.substring(0, 8)}...
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Manual Tracking Entry */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Manual Tracking Entry</h2>
        <p className="text-gray-600 mb-4">
          For providers without API integration, you can manually enter tracking information.
        </p>
        <Link
          href="/admin/orders"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          Go to Orders to add tracking numbers →
        </Link>
      </div>

      {/* Edit Provider Modal */}
      {editingProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Configure {editingProvider.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  type="text"
                  value={editingProvider.apiKey || ''}
                  onChange={(e) =>
                    setEditingProvider({ ...editingProvider, apiKey: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter API key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Secret</label>
                <input
                  type="password"
                  value={editingProvider.apiSecret || ''}
                  onChange={(e) =>
                    setEditingProvider({ ...editingProvider, apiSecret: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter API secret"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tracking URL Template</label>
                <input
                  type="text"
                  value={editingProvider.trackingUrl || ''}
                  onChange={(e) =>
                    setEditingProvider({ ...editingProvider, trackingUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://tracking.example.com/{trackingNumber}"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={editingProvider.enabled}
                  onChange={(e) =>
                    setEditingProvider({ ...editingProvider, enabled: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600"
                />
                <label htmlFor="enabled" className="ml-2 text-sm text-gray-700">
                  Enable this provider
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setEditingProvider(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(editingProvider)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

