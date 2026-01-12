/**
 * Product SEO Settings Page
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  focusKeyword?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export default function ProductSEOPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seoData, setSeoData] = useState<SEOData>({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    focusKeyword: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: '',
    noindex: false,
    nofollow: false,
  });
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    fetchProductSEO();
  }, [productId]);

  const fetchProductSEO = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        const product = data.product;
        setSeoData({
          metaTitle: (product as any).seo?.metaTitle || '',
          metaDescription: (product as any).seo?.metaDescription || '',
          metaKeywords: (product as any).seo?.metaKeywords || [],
          focusKeyword: (product as any).seo?.focusKeyword || '',
          ogTitle: (product as any).seo?.ogTitle || '',
          ogDescription: (product as any).seo?.ogDescription || '',
          ogImage: (product as any).seo?.ogImage || '',
          canonicalUrl: (product as any).seo?.canonicalUrl || '',
          noindex: (product as any).seo?.noindex || false,
          nofollow: (product as any).seo?.nofollow || false,
        });
      }
    } catch (error) {
      toast.error('Failed to load SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // First get current product data
      const productRes = await fetch(`/api/admin/products/${productId}`);
      const productData = await productRes.json();
      const product = productData.product;

      // Update product with SEO data
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          seo: seoData,
        }),
      });

      if (res.ok) {
        toast.success('SEO settings saved successfully');
        router.push(`/admin/products/${productId}/edit`);
      } else {
        toast.error('Failed to save SEO settings');
      }
    } catch (error) {
      toast.error('Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword && !seoData.metaKeywords?.includes(newKeyword)) {
      setSeoData({
        ...seoData,
        metaKeywords: [...(seoData.metaKeywords || []), newKeyword],
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setSeoData({
      ...seoData,
      metaKeywords: seoData.metaKeywords?.filter((k) => k !== keyword) || [],
    });
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
        <h1 className="text-3xl font-bold">Product SEO Settings</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Focus Keyword */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Focus Keyword *
          </label>
          <input
            type="text"
            required
            value={seoData.focusKeyword}
            onChange={(e) => setSeoData({ ...seoData, focusKeyword: e.target.value })}
            placeholder="e.g., dinosaur party set for 3-5 year olds"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            The main keyword you want to rank for (should appear in title and description)
          </p>
        </div>

        {/* Meta Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Title *
          </label>
          <input
            type="text"
            required
            value={seoData.metaTitle}
            onChange={(e) => setSeoData({ ...seoData, metaTitle: e.target.value })}
            placeholder="e.g., Dinosaur Party Set for 3-5 Year Olds - All-in-One Decoration & Tableware"
            maxLength={60}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            {seoData.metaTitle.length}/60 characters (recommended: 50-60)
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Description *
          </label>
          <textarea
            required
            value={seoData.metaDescription}
            onChange={(e) => setSeoData({ ...seoData, metaDescription: e.target.value })}
            placeholder="e.g., Worried about party setup? This dinosaur party set includes 15 decorations, ready in 30 minutes! Perfect for ages 3-5."
            maxLength={160}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            {seoData.metaDescription.length}/160 characters (recommended: 150-160)
          </p>
        </div>

        {/* Meta Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Keywords
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
              placeholder="Add keyword"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Add
            </button>
          </div>
          {seoData.metaKeywords && seoData.metaKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {seoData.metaKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Open Graph */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Open Graph (Social Media)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Title
              </label>
              <input
                type="text"
                value={seoData.ogTitle}
                onChange={(e) => setSeoData({ ...seoData, ogTitle: e.target.value })}
                placeholder="Leave empty to use meta title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Description
              </label>
              <textarea
                value={seoData.ogDescription}
                onChange={(e) => setSeoData({ ...seoData, ogDescription: e.target.value })}
                placeholder="Leave empty to use meta description"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Image URL
              </label>
              <input
                type="url"
                value={seoData.ogImage}
                onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
                placeholder="https://example.com/og-image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Advanced */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Canonical URL
              </label>
              <input
                type="url"
                value={seoData.canonicalUrl}
                onChange={(e) => setSeoData({ ...seoData, canonicalUrl: e.target.value })}
                placeholder="Leave empty for auto-generated"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={seoData.noindex}
                  onChange={(e) => setSeoData({ ...seoData, noindex: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Noindex (prevent search engines from indexing)</span>
              </label>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={seoData.nofollow}
                  onChange={(e) => setSeoData({ ...seoData, nofollow: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Nofollow (prevent search engines from following links)</span>
              </label>
            </div>
          </div>
        </div>

        {/* SEO Preview */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Search Engine Preview</h3>
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="text-blue-600 text-sm mb-1">
              {process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/products/{productId}
            </div>
            <div className="text-xl text-blue-600 mb-1 hover:underline">
              {seoData.metaTitle || 'Meta Title'}
            </div>
            <div className="text-sm text-gray-600">
              {seoData.metaDescription || 'Meta description will appear here...'}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save SEO Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

