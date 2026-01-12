/**
 * 管理后台仪表板
 * 
 * 参考 Shopify 仪表板设计
 * - 性能概览（访问量、销售额、订单数、转化率）
 * - 快速操作卡片
 * - 销售趋势图表
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
  visits: number;
  visitsChange: number;
  totalSales: number;
  salesChange: number;
  orders: number;
  ordersChange: number;
  conversionRate: number;
  conversionChange: number;
}

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    visits: 1,
    visitsChange: 89,
    totalSales: 0,
    salesChange: 0,
    orders: 0,
    ordersChange: 0,
    conversionRate: 0,
    conversionChange: 0,
  });

  const [timeRange, setTimeRange] = useState('30');
  const [channel, setChannel] = useState('all');

  // 示例销售数据
  const salesData: SalesData[] = [
    { date: '1月1日', sales: 0, orders: 0 },
    { date: '1月8日', sales: 0, orders: 0 },
    { date: '1月15日', sales: 0, orders: 0 },
    { date: '1月22日', sales: 0, orders: 0 },
    { date: '1月29日', sales: 0, orders: 0 },
  ];

  useEffect(() => {
    // 从 API 获取统计数据
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {
        // 使用默认数据
      });
  }, [timeRange, channel]);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">仪表板</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">过去7天</option>
            <option value="30">过去30天</option>
            <option value="90">过去90天</option>
          </select>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有渠道</option>
            <option value="online">在线商店</option>
            <option value="pos">POS</option>
          </select>
        </div>
      </div>

      {/* 性能指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">访问</span>
            <span
              className={`text-sm font-semibold ${
                stats.visitsChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stats.visitsChange >= 0 ? '↑' : '↓'} {Math.abs(stats.visitsChange)}%
            </span>
          </div>
          <div className="text-3xl font-bold">{stats.visits}</div>
          <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${Math.min(stats.visitsChange, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">总销售额</span>
            <span
              className={`text-sm font-semibold ${
                stats.salesChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stats.salesChange >= 0 ? '↑' : '↓'} {Math.abs(stats.salesChange)}%
            </span>
          </div>
          <div className="text-3xl font-bold">US${stats.totalSales.toFixed(2)}</div>
          <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${Math.min(Math.abs(stats.salesChange), 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">订单</span>
            <span
              className={`text-sm font-semibold ${
                stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stats.ordersChange >= 0 ? '↑' : '↓'} {Math.abs(stats.ordersChange)}%
            </span>
          </div>
          <div className="text-3xl font-bold">{stats.orders}</div>
          <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500"
              style={{ width: `${Math.min(Math.abs(stats.ordersChange), 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">转化率</span>
            <span
              className={`text-sm font-semibold ${
                stats.conversionChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stats.conversionChange >= 0 ? '↑' : '↓'} {Math.abs(stats.conversionChange)}%
            </span>
          </div>
          <div className="text-3xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
          <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${Math.min(stats.conversionRate, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 快速操作卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 产品管理卡片 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <span className="mr-2">🎈</span>
                KIDDKRAYS
              </h2>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div className="relative h-48 bg-gradient-to-br from-pink-200 via-blue-200 to-purple-200 rounded-lg mb-4 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🎈</div>
                  <p className="text-sm text-gray-700">产品图片</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold">KIDDKRAYS 12-inch macaron colored...</p>
                <p className="text-gray-600 text-sm">$9.99</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 bg-pink-300 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-blue-300 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-green-300 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-yellow-300 rounded-full border-2 border-white"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">已添加产品</span>
              </div>
              <Link
                href="/admin/products"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                导入产品
              </Link>
            </div>
          </div>
        </div>

        {/* 在线商店自定义卡片 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">自定义您的在线商店</h2>
            <div className="relative h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden border-2 border-dashed border-gray-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">网站预览</p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              添加您的logo、颜色和图片，让您的品牌焕发生机。
            </p>
            <Link
              href="/admin/images"
              className="block w-full px-4 py-2 bg-gray-800 text-white text-center rounded-lg hover:bg-gray-900 transition-colors"
            >
              自定义模板
            </Link>
          </div>
        </div>
      </div>

      {/* 设置任务卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-4">设置 Shopify Payments</h3>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
            <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
              MC
            </div>
            <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
              AMEX
            </div>
          </div>
          <Link
            href="/admin/settings"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            开始设置 →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-4">检查您的运费</h3>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">🇺🇸</span>
            <span className="text-sm text-gray-600">国内</span>
          </div>
          <Link
            href="/admin/settings"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            查看运费 →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-4">设置您的URL 重定向</h3>
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm text-gray-600">0 已添加</span>
          </div>
          <Link
            href="/admin/settings"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            管理重定向 →
          </Link>
        </div>
      </div>

      {/* 销售趋势图表 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">销售趋势</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="销售额" />
            <Line type="monotone" dataKey="orders" stroke="#10b981" name="订单数" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

