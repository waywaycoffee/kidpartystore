/**
 * Translation Management Interface
 * 翻译管理界面
 */

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Translation {
  id: string;
  key: string;
  language: string;
  value: string;
  status: 'translated' | 'pending' | 'needs-review';
  updatedAt: string;
}

const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko'];

export default function TranslationsPage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<Translation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTranslations();
  }, [selectedLanguage]);

  const fetchTranslations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/translations?language=${selectedLanguage}`);
      if (res.ok) {
        const data = await res.json();
        setTranslations(data.translations || []);
      }
    } catch (error) {
      console.error('Failed to fetch translations:', error);
      toast.error('Failed to load translations');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (translation: Translation) => {
    try {
      const res = await fetch(`/api/admin/translations/${translation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(translation),
      });

      if (res.ok) {
        toast.success('Translation saved');
        fetchTranslations();
        setEditing(null);
      } else {
        toast.error('Failed to save translation');
      }
    } catch (error) {
      console.error('Error saving translation:', error);
      toast.error('Failed to save translation');
    }
  };

  const handleBatchTranslate = async () => {
    if (!confirm('This will use AI to translate all pending translations. Continue?')) return;

    try {
      const res = await fetch('/api/admin/translations/batch-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: selectedLanguage }),
      });

      if (res.ok) {
        toast.success('Batch translation completed');
        fetchTranslations();
      } else {
        toast.error('Batch translation failed');
      }
    } catch (error) {
      console.error('Error in batch translation:', error);
      toast.error('Batch translation failed');
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/admin/translations/export?language=${selectedLanguage}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `translations-${selectedLanguage}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Translations exported');
      }
    } catch (error) {
      console.error('Error exporting translations:', error);
      toast.error('Failed to export translations');
    }
  };

  const filteredTranslations = translations.filter((t) =>
    t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: translations.length,
    translated: translations.filter((t) => t.status === 'translated').length,
    pending: translations.filter((t) => t.status === 'pending').length,
    needsReview: translations.filter((t) => t.status === 'needs-review').length,
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Translation Management</h1>
          <p className="text-gray-600 mt-2">Manage translations for all languages</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleBatchTranslate}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
          >
            AI Batch Translate
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
          >
            Export
          </button>
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="flex gap-4 ml-auto">
            <div className="text-sm">
              <span className="text-gray-600">Total: </span>
              <span className="font-semibold">{stats.total}</span>
            </div>
            <div className="text-sm">
              <span className="text-green-600">Translated: </span>
              <span className="font-semibold">{stats.translated}</span>
            </div>
            <div className="text-sm">
              <span className="text-yellow-600">Pending: </span>
              <span className="font-semibold">{stats.pending}</span>
            </div>
            <div className="text-sm">
              <span className="text-red-600">Needs Review: </span>
              <span className="font-semibold">{stats.needsReview}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search translations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Translations List */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Translation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTranslations.map((translation) => (
                <tr key={translation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {translation.key}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {editing?.id === translation.id ? (
                      <input
                        type="text"
                        value={editing.value}
                        onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                        className="w-full px-3 py-1 border rounded"
                        autoFocus
                      />
                    ) : (
                      translation.value
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        translation.status === 'translated'
                          ? 'bg-green-100 text-green-800'
                          : translation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {translation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {editing?.id === translation.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(editing)}
                          className="text-green-600 hover:text-green-700 font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="text-gray-600 hover:text-gray-700 font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditing(translation)}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

