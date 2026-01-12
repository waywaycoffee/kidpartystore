/**
 * SEO Management Dashboard
 */

'use client';

import Link from 'next/link';

export default function SEOPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">SEO Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Keywords Management */}
        <Link
          href="/admin/seo/keywords"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Keywords Management</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Manage SEO keywords: demand keywords, product keywords, and long-tail keywords for better search rankings.
          </p>
        </Link>

        {/* Sitemap */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Sitemap</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            XML sitemap is automatically generated and available at:
          </p>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm break-all"
          >
            {process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sitemap.xml
          </a>
        </div>

        {/* Robots.txt */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Robots.txt</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Robots.txt file is automatically generated and available at:
          </p>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm break-all"
          >
            {process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/robots.txt
          </a>
        </div>

        {/* SEO Guidelines */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">SEO Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Title Optimization</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Include 1-2 keywords naturally</li>
                <li>Keep title under 60 characters</li>
                <li>Include brand name at the end</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Description Optimization</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Include pain points and solutions</li>
                <li>Keep description 150-160 characters</li>
                <li>Include a call-to-action</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Keyword Strategy</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Focus on long-tail keywords (low competition)</li>
                <li>Use demand keywords for content</li>
                <li>Use product keywords for product pages</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Content Quality</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Publish high-value blog posts weekly</li>
                <li>Use H2-H3 tags for structure</li>
                <li>Naturally include product links</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

