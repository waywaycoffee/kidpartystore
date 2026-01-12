/**
 * 销售分析页面
 * 
 * 功能：
 * - 销售趋势图表
 * - 产品销售排行
 * - 地区销售分布
 * - 客户分析
 */

'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

interface ProductSales {
  name: string;
  sales: number;
  orders: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const data = await res.json();
      setSalesData(data.salesData || []);
      setProductSales(data.productSales || []);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  // 示例数据
  const exampleSalesData: SalesData[] = [
    { date: '1月1日', sales: 0, orders: 0 },
    { date: '1月8日', sales: 0, orders: 0 },
    { date: '1月15日', sales: 0, orders: 0 },
    { date: '1月22日', sales: 0, orders: 0 },
    { date: '1月29日', sales: 0, orders: 0 },
  ];

  const exampleProductSales: ProductSales[] = [
    { name: 'Disney Princess', sales: 0, orders: 0 },
    { name: 'Unicorn Magic', sales: 0, orders: 0 },
    { name: 'Dinosaur Party', sales: 0, orders: 0 },
  ];

  const displaySalesData = salesData.length > 0 ? salesData : exampleSalesData;
  const displayProductSales =
    productSales.length > 0 ? productSales : exampleProductSales;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">销售分析</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7">过去7天</option>
          <option value="30">过去30天</option>
          <option value="90">过去90天</option>
          <option value="365">过去一年</option>
        </select>
      </div>

      {/* 销售趋势图表 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">销售趋势</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={displaySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              name="销售额 (USD)"
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#10b981"
              name="订单数"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 产品销售排行 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">产品销售排行</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={displayProductSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" name="销售额 (USD)" />
              <Bar dataKey="orders" fill="#10b981" name="订单数" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 产品销售占比 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">产品销售占比</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={displayProductSales}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="sales"
              >
                {displayProductSales.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">详细数据</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                产品名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                销售额
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                订单数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                平均订单金额
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayProductSales.map((product, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.sales.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.orders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $
                  {product.orders > 0
                    ? (product.sales / product.orders).toFixed(2)
                    : '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

