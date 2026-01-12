/**
 * Email Marketing Management Page
 */

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface EmailCampaign {
  id: string;
  type: 'abandoned-cart' | 'promotional' | 'holiday' | 'product-update';
  subject: string;
  content: string;
  segment?: string;
  targetCount: number;
  sentAt: string;
  status: 'sent' | 'failed' | 'scheduled';
  discountCode?: string;
}

export default function EmailMarketingPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'promotional' as 'promotional' | 'holiday' | 'product-update',
    subject: '',
    content: '',
    segment: 'all',
    discountCode: '',
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/email-marketing/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/email-marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Campaign created successfully');
        setShowForm(false);
        setFormData({
          type: 'promotional',
          subject: '',
          content: '',
          segment: 'all',
          discountCode: '',
        });
        fetchCampaigns();
      } else {
        toast.error(data.error || 'Failed to create campaign');
      }
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'promotional': '促销邮件',
      'holiday': '节日促销',
      'product-update': '新品/主题更新',
      'abandoned-cart': '弃购挽回',
    };
    return labels[type] || type;
  };

  const getSegmentLabel = (segment: string) => {
    const labels: Record<string, string> = {
      'all': '所有用户',
      'high-value': '高价值用户',
      'repeat-customers': '复购用户',
      'new-customers': '新用户',
    };
    return labels[segment] || segment;
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
        <h1 className="text-3xl font-bold">Email Marketing</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'New Campaign'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Create Email Campaign</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="promotional">促销邮件</option>
                  <option value="holiday">节日促销</option>
                  <option value="product-update">新品/主题更新</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Segment *
                </label>
                <select
                  required
                  value={formData.segment}
                  onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">所有用户</option>
                  <option value="high-value">高价值用户</option>
                  <option value="repeat-customers">复购用户</option>
                  <option value="new-customers">新用户</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., 宝宝生日季福利！派对套餐8折"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                避免使用"最好"、"必买"等绝对化用词，易被屏蔽
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content (HTML) *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                placeholder="Enter HTML content..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                支持HTML格式，建议包含产品图片和折扣码
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Code (Optional)
              </label>
              <input
                type="text"
                value={formData.discountCode}
                onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
                placeholder="e.g., BIRTHDAY20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Campaign
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaign Templates */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Email Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer">
            <h3 className="font-semibold mb-2">节日促销模板</h3>
            <p className="text-sm text-gray-600 mb-3">
              适用于生日季、圣诞节等节日促销
            </p>
            <button
              onClick={() => {
                setFormData({
                  type: 'holiday',
                  subject: '宝宝生日季福利！派对套餐8折，附3个布置小技巧',
                  content: '<div>左侧放套餐图+折扣码，右侧写3个快速布置技巧</div>',
                  segment: 'all',
                  discountCode: 'BIRTHDAY20',
                });
                setShowForm(true);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Use Template →
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer">
            <h3 className="font-semibold mb-2">新品/主题更新模板</h3>
            <p className="text-sm text-gray-600 mb-3">
              适用于新品上线、主题更新通知
            </p>
            <button
              onClick={() => {
                setFormData({
                  type: 'product-update',
                  subject: '2025太空主题派对上线！首批用户立减$5',
                  content: '<div>展示太空主题套餐实拍，说明适合年龄段，附用户实拍反馈</div>',
                  segment: 'all',
                  discountCode: 'NEWTHEME5',
                });
                setShowForm(true);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Use Template →
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer">
            <h3 className="font-semibold mb-2">弃购挽回模板</h3>
            <p className="text-sm text-gray-600 mb-3">
              自动发送，1小时后触发
            </p>
            <p className="text-xs text-gray-500">
              系统自动处理，无需手动创建
            </p>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Campaign History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Target Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sent At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No campaigns yet
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {getTypeLabel(campaign.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{campaign.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {getSegmentLabel(campaign.segment || 'all')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {campaign.targetCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(campaign.sentAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          campaign.status === 'sent'
                            ? 'bg-green-100 text-green-800'
                            : campaign.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">Email Marketing Best Practices</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• 控制发送频次：每月2-4次，避免过度打扰</li>
          <li>• 标题避免绝对化用词（如"最好"、"必买"），易被屏蔽</li>
          <li>• 内容包含价值：除了促销，还要提供实用技巧和灵感</li>
          <li>• 个性化：根据用户购买历史推荐相关产品</li>
          <li>• 移动端优化：确保邮件在手机上显示良好</li>
        </ul>
      </div>
    </div>
  );
}

