/**
 * Form Builder - Main Page
 * 可视化表单构建器主页面
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: {
    emailNotification?: string;
    webhookUrl?: string;
    saveToDatabase: boolean;
    redirectUrl?: string;
    successMessage?: string;
  };
  createdAt: string;
  updatedAt: string;
  submissionCount: number;
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'number';
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: string[]; // For select, radio, checkbox
  conditional?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains';
    value: string;
  };
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await fetch('/api/admin/forms');
      if (res.ok) {
        const data = await res.json();
        setForms(data.forms || []);
      }
    } catch (error) {
      console.error('Failed to fetch forms:', error);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;

    try {
      const res = await fetch(`/api/admin/forms/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Form deleted');
        fetchForms();
      } else {
        toast.error('Failed to delete form');
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Failed to delete form');
    }
  };

  const filteredForms = forms.filter((form) =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Form Builder</h1>
          <p className="text-gray-600 mt-2">Create and manage custom forms</p>
        </div>
        <Link
          href="/admin/forms/new"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
        >
          + Create New Form
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search forms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Forms List */}
      {filteredForms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 mb-4">No forms found</p>
          <Link
            href="/admin/forms/new"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Create your first form →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <div key={form.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{form.name}</h3>
                  {form.description && (
                    <p className="text-sm text-gray-600">{form.description}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fields:</span>
                  <span className="font-semibold">{form.fields.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Submissions:</span>
                  <span className="font-semibold">{form.submissionCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Updated:</span>
                  <span>{new Date(form.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Link
                  href={`/admin/forms/${form.id}/edit`}
                  className="flex-1 text-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm font-semibold"
                >
                  Edit
                </Link>
                <Link
                  href={`/admin/forms/${form.id}/submissions`}
                  className="flex-1 text-center bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                >
                  Submissions
                </Link>
                <button
                  onClick={() => handleDelete(form.id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

