/**
 * Advanced Analytics
 * 高级分析工具 - 用户行为分析、转化漏斗
 */

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface AnalyticsData {
  pageViews: Array<{ page: string; views: number }>;
  userPaths: Array<{ path: string; count: number }>;
  conversionFunnel: {
    visitors: number;
    addToCart: number;
    checkout: number;
    completed: number;
  };
  topPages: Array<{ page: string; views: number; bounceRate: number }>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

export default function AdvancedAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/analytics/advanced?range=${dateRange}`);
      if (res.ok) {
        const analyticsData = await res.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const calculateConversionRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current / previous) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">No analytics data available</div>
      </div>
    );
  }

  const { conversionFunnel } = data;
  const visitorToCartRate = calculateConversionRate(conversionFunnel.addToCart, conversionFunnel.visitors);
  const cartToCheckoutRate = calculateConversionRate(conversionFunnel.checkout, conversionFunnel.addToCart);
  const checkoutToCompleteRate = calculateConversionRate(conversionFunnel.completed, conversionFunnel.checkout);
  const overallConversionRate = calculateConversionRate(conversionFunnel.completed, conversionFunnel.visitors);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-gray-600 mt-2">User behavior analysis and conversion funnel</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d')}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Conversion Funnel</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm font-medium">Visitors</div>
            <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
              <div
                className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm font-semibold"
                style={{ width: '100%' }}
              >
                {conversionFunnel.visitors}
              </div>
            </div>
            <div className="w-24 text-sm text-gray-600">100%</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm font-medium">Add to Cart</div>
            <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
              <div
                className="bg-green-600 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm font-semibold"
                style={{ width: `${visitorToCartRate}%` }}
              >
                {conversionFunnel.addToCart}
              </div>
            </div>
            <div className="w-24 text-sm text-gray-600">{visitorToCartRate}%</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm font-medium">Checkout</div>
            <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
              <div
                className="bg-yellow-600 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm font-semibold"
                style={{ width: `${cartToCheckoutRate}%` }}
              >
                {conversionFunnel.checkout}
              </div>
            </div>
            <div className="w-24 text-sm text-gray-600">{cartToCheckoutRate}%</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm font-medium">Completed</div>
            <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
              <div
                className="bg-purple-600 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm font-semibold"
                style={{ width: `${checkoutToCompleteRate}%` }}
              >
                {conversionFunnel.completed}
              </div>
            </div>
            <div className="w-24 text-sm text-gray-600">{checkoutToCompleteRate}%</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Conversion Rate</span>
            <span className="text-2xl font-bold text-primary-600">{overallConversionRate}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Top Pages</h2>
          <div className="space-y-3">
            {data.topPages.map((page, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="font-medium">{page.page}</div>
                  <div className="text-sm text-gray-500">Bounce Rate: {page.bounceRate}%</div>
                </div>
                <div className="text-lg font-semibold">{page.views}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Device Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Desktop</span>
                <span className="font-semibold">{data.deviceBreakdown.desktop}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (data.deviceBreakdown.desktop /
                        (data.deviceBreakdown.desktop +
                          data.deviceBreakdown.mobile +
                          data.deviceBreakdown.tablet)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Mobile</span>
                <span className="font-semibold">{data.deviceBreakdown.mobile}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (data.deviceBreakdown.mobile /
                        (data.deviceBreakdown.desktop +
                          data.deviceBreakdown.mobile +
                          data.deviceBreakdown.tablet)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Tablet</span>
                <span className="font-semibold">{data.deviceBreakdown.tablet}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (data.deviceBreakdown.tablet /
                        (data.deviceBreakdown.desktop +
                          data.deviceBreakdown.mobile +
                          data.deviceBreakdown.tablet)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Paths */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Common User Paths</h2>
        <div className="space-y-2">
          {data.userPaths.slice(0, 10).map((path, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <div className="text-sm font-mono">{path.path}</div>
              <div className="text-sm font-semibold">{path.count} users</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

