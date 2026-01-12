/**
 * 客户管理页面
 */

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Customer {
  email: string;
  name?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  addresses?: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        const orders = data.orders || [];
        
        // 从订单中提取客户信息
        const customerMap = new Map<string, Customer>();
        
        orders.forEach((order: any) => {
          const email = order.email;
          if (!customerMap.has(email)) {
            customerMap.set(email, {
              email,
              name: order.shippingAddress?.firstName 
                ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName || ''}`.trim()
                : undefined,
              totalOrders: 0,
              totalSpent: 0,
              addresses: 0,
            });
          }
          
          const customer = customerMap.get(email)!;
          customer.totalOrders += 1;
          customer.totalSpent += order.pricing?.total || 0;
          
          if (!customer.lastOrderDate || order.createdAt > customer.lastOrderDate) {
            customer.lastOrderDate = order.createdAt;
          }
        });
        
        const customerList = Array.from(customerMap.values())
          .sort((a, b) => b.totalSpent - a.totalSpent);
        
        setCustomers(customerList);
      }
    } catch (error) {
      toast.error('加载客户失败');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    if (searchTerm) {
      return (
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">客户管理</h1>
        <input
          type="text"
          placeholder="搜索客户..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">暂无客户</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    客户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    订单数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    总消费
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最后订单
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.email} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name || '未命名'}
                      </div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.totalOrders}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${customer.totalSpent.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString('zh-CN')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-sm text-gray-600">
          共 {filteredCustomers.length} 位客户
        </div>
      </div>
    </div>
  );
}

