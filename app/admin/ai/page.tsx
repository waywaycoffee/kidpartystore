/**
 * AI Tools Dashboard
 */

'use client';

import Link from 'next/link';

export default function AIToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Tools</h1>
          <p className="text-gray-500 mt-2">
            Leverage AI to automate content generation, customer service, and marketing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Content Generator */}
        <Link
          href="/admin/ai/content-generator"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Content Generator</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Generate product descriptions, SEO content, and marketing materials in multiple languages.
          </p>
        </Link>

        {/* AI Chatbot */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">AI Chatbot</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            24/7 multilingual customer service with AI-powered responses. Available on all pages.
          </p>
          <span className="text-xs text-green-600 font-semibold">✓ Active - OpenAI API</span>
          <p className="text-xs text-gray-500 mt-2">For advanced features, integrate Coze Agent</p>
        </div>

        {/* Personalization */}
        <Link
          href="/admin/ai/personalization"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Personalization</h2>
          </div>
          <p className="text-gray-600 text-sm mb-2">
            Generate personalized emails and auto-tag users based on behavior.
          </p>
          <span className="text-xs text-green-600 font-semibold">✓ Active</span>
        </Link>

        {/* Video Generator */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Video Generator</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Generate product introduction videos and social media content automatically.
          </p>
          <span className="text-xs text-gray-500">Coming soon - 即梦AI integration</span>
        </div>

        {/* Personalization */}
        <Link
          href="/admin/ai/personalization"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Personalization</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Generate personalized emails and auto-tag users based on their behavior and preferences.
          </p>
        </Link>

        {/* SEO Optimizer */}
        <Link
          href="/admin/seo/keywords"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">SEO Optimizer</h2>
          </div>
          <p className="text-gray-600 text-sm">
            AI-powered keyword research and content optimization for better search rankings.
          </p>
        </Link>

        {/* Inventory Predictor */}
        <Link
          href="/admin/ai/inventory"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Inventory Predictor</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Predict demand and optimize inventory based on sales trends and seasonal patterns.
          </p>
        </Link>
      </div>

      {/* Implementation Guide */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">AI Integration Guide</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. OpenAI API Setup</h3>
            <p className="text-sm text-gray-600 mb-2">
              Add to <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`OPENAI_API_KEY=your_openai_api_key`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Coze Workflow Integration (Coming Soon)</h3>
            <p className="text-sm text-gray-600">
              For complex AI workflows (customer service, personalized recommendations), integrate Coze AI Agent.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. 即梦AI Integration (Coming Soon)</h3>
            <p className="text-sm text-gray-600">
              For video generation and social media content, integrate 即梦AI API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

