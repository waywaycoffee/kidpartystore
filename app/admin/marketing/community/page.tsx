/**
 * Community Management Page
 * Handles WhatsApp/Facebook groups, referral program, and user engagement
 */

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Referral {
  id: string;
  referrerEmail: string;
  referredEmail: string;
  orderId?: string;
  createdAt: string;
  referrerRewarded: boolean;
  referredRewarded: boolean;
  status: 'pending' | 'completed' | 'rewarded';
}

interface CommunityMember {
  email: string;
  whatsapp?: string;
  facebook?: string;
  joinedAt: string;
  tags: string[];
  orderCount: number;
  totalSpent: number;
}

export default function CommunityManagementPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'referrals' | 'members' | 'settings'>('referrals');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [referralsRes, membersRes] = await Promise.all([
        fetch('/api/community/referral'),
        fetch('/api/admin/customers'),
      ]);

      if (referralsRes.ok) {
        const referralsData = await referralsRes.json();
        setReferrals(referralsData.referrals || []);
      }

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        // Transform customers to community members
        const transformedMembers = (membersData.customers || []).map((customer: any) => ({
          email: customer.email,
          whatsapp: customer.whatsapp,
          facebook: customer.facebook,
          joinedAt: customer.createdAt || new Date().toISOString(),
          tags: customer.tags || [],
          orderCount: customer.orderCount || 0,
          totalSpent: customer.totalSpent || 0,
        }));
        setMembers(transformedMembers);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRewardReferral = async (referralId: string, type: 'referrer' | 'referred') => {
    try {
      const res = await fetch('/api/community/referral', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralId,
          [type === 'referrer' ? 'rewardReferrer' : 'rewardReferred']: true,
          status: 'rewarded',
        }),
      });

      if (res.ok) {
        toast.success('Reward processed successfully');
        fetchData();
      } else {
        toast.error('Failed to process reward');
      }
    } catch (error) {
      toast.error('Failed to process reward');
    }
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
        <h1 className="text-3xl font-bold">Community Management</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('referrals')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'referrals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Referral Program
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'members'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Community Members
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Referral Program */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Referral Program Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {referrals.filter((r) => r.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed Referrals</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {referrals.filter((r) => r.status === 'rewarded').length}
                </div>
                <div className="text-sm text-gray-600">Rewarded</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {referrals.filter((r) => r.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Referral List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Referrer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Referred
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referrals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No referrals yet
                      </td>
                    </tr>
                  ) : (
                    referrals.map((referral) => (
                      <tr key={referral.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {referral.referrerEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {referral.referredEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              referral.status === 'rewarded'
                                ? 'bg-green-100 text-green-800'
                                : referral.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {referral.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {!referral.referrerRewarded && (
                            <button
                              onClick={() => handleRewardReferral(referral.id, 'referrer')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Reward Referrer
                            </button>
                          )}
                          {!referral.referredRewarded && (
                            <button
                              onClick={() => handleRewardReferral(referral.id, 'referred')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Reward Referred
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Referral Program Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-green-900">Referral Program Rules</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• 老用户邀请1位宝妈入群并下单，双方各得$10优惠券</li>
              <li>• 被邀请用户首次下单后，双方奖励自动发放</li>
              <li>• 优惠券有效期30天，可用于任意订单</li>
            </ul>
          </div>
        </div>
      )}

      {/* Community Members */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Community Members</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      WhatsApp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No members yet
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr key={member.email} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {member.whatsapp || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {member.orderCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          ${member.totalSpent.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {member.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Community Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Group Link
                </label>
                <input
                  type="text"
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  用户下单后，提示添加客服WhatsApp，发送订单号入群
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook Group Link
                </label>
                <input
                  type="text"
                  placeholder="https://facebook.com/groups/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral Reward Amount
                </label>
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  双方各得的优惠券金额（美元）
                </p>
              </div>

              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Settings
              </button>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-900">Community Management Guidelines</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• <strong>入群门槛：</strong>独立站下单后，提示"添加客服WhatsApp，发送订单号入群，享专属福利"</li>
              <li>• <strong>日常内容：</strong>每周分享"派对灵感图"、"用户晒单"、"新品预告"</li>
              <li>• <strong>互动活动：</strong>每月举办"晒单活动"（如"晒宝宝派对照片，点赞前3名赠套餐"）</li>
              <li>• <strong>用户反馈：</strong>定期收集"想要的派对主题"、"产品改进建议"</li>
              <li>• <strong>避坑点：</strong>安排专人每日回复消息，避免"发广告刷屏"，重点做"互动与价值输出"</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

