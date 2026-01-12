/**
 * 市场营销页面
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'emails' | 'promotions' | 'abandoned-carts' | 'community'>('campaigns');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">市场营销</h1>
      </div>

      {/* 标签页 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            营销活动
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'emails'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            邮件营销
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'promotions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            促销活动
          </button>
          <button
            onClick={() => setActiveTab('abandoned-carts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'abandoned-carts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            废弃购物车
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'community'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            社群运营
          </button>
        </nav>
      </div>

      {/* 内容区域 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">营销活动</h2>
            <p className="text-gray-500">
              创建和管理营销活动，包括广告投放、社交媒体推广等。
            </p>
            <div className="mt-6 text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">功能开发中...</p>
            </div>
          </div>
        )}

        {activeTab === 'emails' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">邮件营销</h2>
                <p className="text-gray-500">
                  创建和管理邮件营销活动，包括节日促销、新品更新、弃购挽回等。
                </p>
              </div>
              <Link
                href="/admin/marketing/email"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                管理邮件营销
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'promotions' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">促销活动</h2>
            <p className="text-gray-500">
              管理限时促销、闪购和特别优惠活动。
            </p>
            <div className="mt-6 text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">功能开发中...</p>
            </div>
          </div>
        )}

        {activeTab === 'abandoned-carts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">废弃购物车</h2>
                <p className="text-gray-500">
                  查看和管理客户未完成的购物车，并发送提醒邮件。
                </p>
              </div>
              <Link
                href="/admin/marketing/abandoned-carts"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                管理废弃购物车
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">社群运营</h2>
                <p className="text-gray-500">
                  管理WhatsApp/Facebook群组，转介绍激励，用户互动和反馈收集。
                </p>
              </div>
              <Link
                href="/admin/marketing/community"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                管理社群
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

