/**
 * SEO Keywords Management Page
 */

'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface SEOKeyword {
  id: string;
  keyword: string;
  category: 'demand' | 'product' | 'long-tail';
  searchVolume?: number;
  competition?: 'low' | 'medium' | 'high';
  priority: 'high' | 'medium' | 'low';
  targetPages: string[];
  createdAt: string;
  updatedAt: string;
}

export default function SEOKeywordsPage() {
  const [keywords, setKeywords] = useState<SEOKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<SEOKeyword | null>(null);
  const [formData, setFormData] = useState({
    keyword: '',
    category: 'long-tail' as 'demand' | 'product' | 'long-tail',
    searchVolume: '',
    competition: 'low' as 'low' | 'medium' | 'high',
    priority: 'medium' as 'high' | 'medium' | 'low',
    targetPages: [] as string[],
  });
  const [newTargetPage, setNewTargetPage] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchKeywords = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/admin/seo/keywords';
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setKeywords(data.keywords || []);
      }
    } catch {
      toast.error('Failed to load keywords');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, priorityFilter]);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingKeyword ? '/api/admin/seo/keywords' : '/api/admin/seo/keywords';
      const method = editingKeyword ? 'PUT' : 'POST';
      const body = editingKeyword
        ? { id: editingKeyword.id, ...formData, searchVolume: formData.searchVolume ? parseInt(formData.searchVolume) : undefined }
        : { ...formData, searchVolume: formData.searchVolume ? parseInt(formData.searchVolume) : undefined };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingKeyword ? 'Keyword updated successfully' : 'Keyword created successfully');
        setShowForm(false);
        setEditingKeyword(null);
        setFormData({
          keyword: '',
          category: 'long-tail',
          searchVolume: '',
          competition: 'low',
          priority: 'medium',
          targetPages: [],
        });
        fetchKeywords();
      } else {
        toast.error(data.error || 'Failed to save keyword');
      }
    } catch {
      toast.error('Failed to save keyword');
    }
  };

  const handleEdit = (keyword: SEOKeyword) => {
    setEditingKeyword(keyword);
    setFormData({
      keyword: keyword.keyword,
      category: keyword.category,
      searchVolume: keyword.searchVolume?.toString() || '',
      competition: keyword.competition || 'low',
      priority: keyword.priority,
      targetPages: keyword.targetPages || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this keyword?')) return;

    try {
      const res = await fetch(`/api/admin/seo/keywords?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Keyword deleted successfully');
        fetchKeywords();
      } else {
        toast.error('Failed to delete keyword');
      }
    } catch {
      toast.error('Failed to delete keyword');
    }
  };

  const handleAddTargetPage = () => {
    if (newTargetPage && !formData.targetPages.includes(newTargetPage)) {
      setFormData({
        ...formData,
        targetPages: [...formData.targetPages, newTargetPage],
      });
      setNewTargetPage('');
    }
  };

  const handleRemoveTargetPage = (page: string) => {
    setFormData({
      ...formData,
      targetPages: formData.targetPages.filter((p) => p !== page),
    });
  };

  const filteredKeywords = keywords.filter((keyword) => {
    if (searchTerm) {
      return keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      demand: '需求词',
      product: '产品词',
      'long-tail': '长尾词',
    };
    return labels[category] || category;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getCompetitionColor = (competition?: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    };
    return colors[competition || 'low'] || 'text-gray-600';
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
        <h1 className="text-3xl font-bold">SEO Keywords Management</h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/ai/content-generator"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            AI Keyword Generator
          </Link>
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="demand">需求词</option>
            <option value="product">产品词</option>
            <option value="long-tail">长尾词</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingKeyword(null);
              setFormData({
                keyword: '',
                category: 'long-tail',
                searchVolume: '',
                competition: 'low',
                priority: 'medium',
                targetPages: [],
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'New Keyword'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingKeyword ? 'Edit Keyword' : 'New Keyword'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keyword *
                </label>
                <input
                  type="text"
                  required
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., kids dinosaur party decoration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as 'demand' | 'product' | 'long-tail' })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="demand">需求词 (Demand)</option>
                  <option value="product">产品词 (Product)</option>
                  <option value="long-tail">长尾词 (Long-tail)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Volume
                </label>
                <input
                  type="number"
                  value={formData.searchVolume}
                  onChange={(e) => setFormData({ ...formData, searchVolume: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Monthly searches"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Competition
                </label>
                <select
                  value={formData.competition}
                  onChange={(e) =>
                    setFormData({ ...formData, competition: e.target.value as 'low' | 'medium' | 'high' })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority *
                </label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Pages
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTargetPage}
                  onChange={(e) => setNewTargetPage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTargetPage())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., /products/dinosaur-party-set"
                />
                <button
                  type="button"
                  onClick={handleAddTargetPage}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Add
                </button>
              </div>
              {formData.targetPages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.targetPages.map((page) => (
                    <span
                      key={page}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {page}
                      <button
                        type="button"
                        onClick={() => handleRemoveTargetPage(page)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingKeyword(null);
                  setFormData({
                    keyword: '',
                    category: 'long-tail',
                    searchVolume: '',
                    competition: 'low',
                    priority: 'medium',
                    targetPages: [],
                  });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingKeyword ? 'Update Keyword' : 'Create Keyword'}
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredKeywords.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No keywords found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Keyword
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Search Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Competition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Target Pages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredKeywords.map((keyword) => (
                  <tr key={keyword.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{keyword.keyword}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {getCategoryLabel(keyword.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {keyword.searchVolume ? keyword.searchVolume.toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${getCompetitionColor(keyword.competition)}`}>
                        {keyword.competition || 'low'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(keyword.priority)}`}>
                        {keyword.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {keyword.targetPages.length > 0 ? (
                          <span>{keyword.targetPages.length} page(s)</span>
                        ) : (
                          <span className="text-gray-400">No pages</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(keyword)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(keyword.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
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
          Total: {filteredKeywords.length} keyword(s)
        </div>
      </div>
    </div>
  );
}

