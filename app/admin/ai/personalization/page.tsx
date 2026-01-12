/**
 * AI Personalization Management Page
 */

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface PersonalizedEmailResult {
  subject?: string;
  greeting?: string;
  body?: string;
  callToAction?: string;
  discountCode?: string;
  recommendations?: Array<{
    productId: string;
    productName: string;
    reason: string;
  }>;
  tags?: string[];
}

export default function AIPersonalizationPage() {
  const [email, setEmail] = useState('');
  const [campaignType, setCampaignType] = useState<'abandoned-cart' | 'product-recommendation' | 'birthday-reminder' | 'holiday-promotion'>('product-recommendation');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PersonalizedEmailResult | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/personalize-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, campaignType }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.content);
        toast.success('Personalized email generated!');
      } else {
        toast.error(data.error || 'Failed to generate email');
      }
    } catch {
      toast.error('Failed to generate email');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTags = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/ai/user-tags?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (res.ok) {
        toast.success(`Generated ${data.tags.length} tags for user`);
        setResult({ ...result, tags: data.tags });
      } else {
        toast.error(data.error || 'Failed to generate tags');
      }
    } catch {
      toast.error('Failed to generate tags');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Personalization</h1>
          <p className="text-gray-500 mt-2">
            Generate personalized emails and auto-tag users based on their behavior
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Generate Personalized Content</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Type *
              </label>
              <select
                required
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value as 'abandoned-cart' | 'product-recommendation' | 'birthday-reminder' | 'holiday-promotion')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="product-recommendation">Product Recommendation</option>
                <option value="abandoned-cart">Abandoned Cart Recovery</option>
                <option value="birthday-reminder">Birthday Reminder</option>
                <option value="holiday-promotion">Holiday Promotion</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Email'}
              </button>
              <button
                type="button"
                onClick={handleGenerateTags}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Generate Tags
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Content</h2>
          {!result ? (
            <div className="text-center py-12 text-gray-500">
              Generated content will appear here
            </div>
          ) : (
            <div className="space-y-4">
              {result.subject && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-1">
                    <p className="text-sm">{result.subject}</p>
                  </div>
                </div>
              )}

              {result.body && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Body</label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-1">
                    <p className="text-sm whitespace-pre-wrap">{result.greeting}</p>
                    <p className="text-sm whitespace-pre-wrap mt-2">{result.body}</p>
                    <p className="text-sm font-semibold mt-2">{result.callToAction}</p>
                  </div>
                </div>
              )}

              {result.tags && result.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">User Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {result.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

