/**
 * 内容管理页面
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<'pages' | 'blog' | 'faq' | 'menus'>('pages');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">内容管理</h1>
      </div>

      {/* 标签页 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pages')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            页面内容
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'blog'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            博客文章
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'faq'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('menus')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'menus'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Menus
          </button>
        </nav>
      </div>

      {/* 内容区域 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'pages' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Pages Management</h2>
                <p className="text-gray-500">
                  Create and manage static pages like About Us, Contact, Privacy Policy, etc.
                </p>
              </div>
              <Link
                href="/admin/content/pages"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Manage Pages
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Blog Posts</h2>
                <p className="text-gray-500">
                  Create and manage blog posts to share product tips, party planning inspiration, and more.
                </p>
              </div>
              <Link
                href="/admin/content/blog"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Manage Posts
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">FAQ Management</h2>
                <p className="text-gray-500">
                  Manage frequently asked questions to help customers find answers quickly.
                </p>
              </div>
              <Link
                href="/admin/content/faq"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Manage FAQs
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'menus' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Menus Management</h2>
                <p className="text-gray-500">
                  Create and manage navigation menus for header, footer, and sidebar.
                </p>
              </div>
              <Link
                href="/admin/content/menus"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Manage Menus
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

