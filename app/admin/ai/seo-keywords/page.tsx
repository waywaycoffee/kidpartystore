/**
 * AI SEO Keywords Generator Page
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AISEOKeywordsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productInfo: '',
    targetMarket: 'US',
  });
  const [result, setResult] = useState<{
    demandKeywords: string[];
    productKeywords: string[];
    longTailKeywords: string[];
  } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productInfo.trim()) {
      toast.error('Please enter product information');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/seo-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.keywords);
        toast.success('Keywords generated successfully!');
      } else {
        toast.error(data.error || 'Failed to generate keywords');
      }
    } catch {
      toast.error('Failed to generate keywords');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToKeywords = async (keyword: string, category: 'demand' | 'product' | 'long-tail') => {
    try {
      const res = await fetch('/api/admin/seo/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          category,
          priority: category === 'long-tail' ? 'high' : category === 'demand' ? 'medium' : 'low',
        }),
      });

      if (res.ok) {
        toast.success('Keyword added to management system!');
      } else {
        toast.error('Failed to add keyword');
      }
    } catch {
      toast.error('Failed to add keyword');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI SEO Keywords Generator</h1>
          <p className="text-gray-500 mt-2">
            Use AI to discover high-value SEO keywords for your products
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/seo/keywords')}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to Keywords
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Generate Keywords</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Information *
              </label>
              <textarea
                required
                value={formData.productInfo}
                onChange={(e) => setFormData({ ...formData, productInfo: e.target.value })}
                placeholder="Describe your product, target audience, key features, etc."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Market
              </label>
              <select
                value={formData.targetMarket}
                onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="EU">Europe</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Keywords'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Keywords</h2>
          {!result ? (
            <div className="text-center py-12 text-gray-500">
              Generated keywords will appear here
            </div>
          ) : (
            <div className="space-y-6">
              {/* Demand Keywords */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Demand Keywords</label>
                  <span className="text-xs text-gray-500">How-to, ideas, tips</span>
                </div>
                <div className="space-y-2">
                  {result.demandKeywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm">{keyword}</span>
                      <button
                        onClick={() => handleAddToKeywords(keyword, 'demand')}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Keywords */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Product Keywords</label>
                  <span className="text-xs text-gray-500">Product names, categories</span>
                </div>
                <div className="space-y-2">
                  {result.productKeywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">{keyword}</span>
                      <button
                        onClick={() => handleAddToKeywords(keyword, 'product')}
                        className="text-xs text-green-600 hover:text-green-800"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long-tail Keywords */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Long-tail Keywords</label>
                  <span className="text-xs text-gray-500">High priority - low competition</span>
                </div>
                <div className="space-y-2">
                  {result.longTailKeywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <span className="text-sm">{keyword}</span>
                      <button
                        onClick={() => handleAddToKeywords(keyword, 'long-tail')}
                        className="text-xs text-purple-600 hover:text-purple-800"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">Keyword Strategy Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Long-tail keywords</strong> have lower competition and higher conversion rates - prioritize these</li>
          <li>• <strong>Demand keywords</strong> are great for blog content and SEO</li>
          <li>• <strong>Product keywords</strong> should be included in product titles and descriptions</li>
          <li>• Add generated keywords to your SEO management system for tracking</li>
        </ul>
      </div>
    </div>
  );
}

