/**
 * AI Content Generator Page
 * Generate product descriptions, SEO content, and marketing materials using AI
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface GenerationResult {
  title?: string;
  description?: string;
  seoKeywords?: string[];
  faq?: Array<{ question: string; answer: string }>;
  language?: string;
}

export default function AIContentGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    productCategory: 'themePackages',
    targetLanguage: 'en',
    productInfo: '',
    includeFAQ: true,
    includeSEO: true,
  });
  const [result, setResult] = useState<GenerationResult | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.result);
        toast.success('Content generated successfully!');
      } else {
        toast.error(data.error || 'Failed to generate content');
      }
    } catch {
      toast.error('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Content Generator</h1>
          <p className="text-gray-500 mt-2">
            Generate product descriptions, SEO content, and marketing materials using AI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Generate Content</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="e.g., Dinosaur Party Set for 3-5 Year Olds"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Category *
              </label>
              <select
                required
                value={formData.productCategory}
                onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="themePackages">Theme Packages</option>
                <option value="balloons">Balloons</option>
                <option value="decorations">Decorations</option>
                <option value="tableware">Tableware</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Language *
              </label>
              <select
                required
                value={formData.targetLanguage}
                onChange={(e) => setFormData({ ...formData, targetLanguage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ar">Arabic</option>
                <option value="zh">Chinese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Information
              </label>
              <textarea
                value={formData.productInfo}
                onChange={(e) => setFormData({ ...formData, productInfo: e.target.value })}
                placeholder="Enter product details, features, target age, etc."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.includeSEO}
                  onChange={(e) => setFormData({ ...formData, includeSEO: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Include SEO Keywords</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.includeFAQ}
                  onChange={(e) => setFormData({ ...formData, includeFAQ: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Generate FAQ</span>
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> After generating content, you can add the SEO keywords directly to the keywords management system.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Content'}
              </button>
              <Link
                href="/admin/ai/seo-keywords"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Generate Keywords
              </Link>
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
              {result.title && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Title</label>
                    <button
                      onClick={() => handleCopy(result.title!)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm">{result.title}</p>
                  </div>
                </div>
              )}

              {result.description && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <button
                      onClick={() => handleCopy(result.description!)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm whitespace-pre-wrap">{result.description}</p>
                  </div>
                </div>
              )}

              {result.seoKeywords && result.seoKeywords.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">SEO Keywords</label>
                    <button
                      onClick={() => handleCopy(result.seoKeywords!.join(', '))}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.seoKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.faq && result.faq.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">FAQ</label>
                    <button
                      onClick={() => handleCopy(JSON.stringify(result.faq, null, 2))}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="space-y-2">
                    {result.faq.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-semibold text-sm mb-1">Q: {item.question}</p>
                        <p className="text-sm text-gray-600">A: {item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">Usage Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Provide detailed product information for better results</li>
          <li>• Select the target market language for localization</li>
          <li>• Review and edit AI-generated content before publishing</li>
          <li>• Use SEO keywords in product titles and descriptions</li>
          <li>• FAQ helps answer common customer questions</li>
        </ul>
      </div>
    </div>
  );
}

