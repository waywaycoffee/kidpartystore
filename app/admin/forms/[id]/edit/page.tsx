/**
 * Form Builder - Edit Form
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormBuilder from '@/components/FormBuilder';
import toast from 'react-hot-toast';

interface FormField {
  id: string;
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  validation?: any;
  options?: string[];
}

interface FormSettings {
  emailNotification?: string;
  webhookUrl?: string;
  saveToDatabase: boolean;
  redirectUrl?: string;
  successMessage?: string;
}

export default function EditFormPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<{
    id: string;
    name: string;
    description?: string;
    fields: FormField[];
    settings: FormSettings;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [params.id]);

  const fetchForm = async () => {
    try {
      const res = await fetch(`/api/admin/forms/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setForm(data.form);
      } else {
        toast.error('Form not found');
        router.push('/admin/forms');
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/forms/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('Form saved successfully');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to save form');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Edit Form</h1>
        <p className="text-gray-600">Modify your form fields and settings</p>
      </div>

      {/* Form Basic Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Form Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Form Builder */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Form Fields</h2>
        <FormBuilder
          fields={form.fields}
          setFields={(fields) => setForm({ ...form, fields })}
        />
      </div>

      {/* Form Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Form Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Notification</label>
            <input
              type="email"
              value={form.settings.emailNotification || ''}
              onChange={(e) => setForm({ ...form, settings: { ...form.settings, emailNotification: e.target.value } })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
            <input
              type="url"
              value={form.settings.webhookUrl || ''}
              onChange={(e) => setForm({ ...form, settings: { ...form.settings, webhookUrl: e.target.value } })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Success Message</label>
            <input
              type="text"
              value={form.settings.successMessage || ''}
              onChange={(e) => setForm({ ...form, settings: { ...form.settings, successMessage: e.target.value } })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Redirect URL (optional)</label>
            <input
              type="url"
              value={form.settings.redirectUrl || ''}
              onChange={(e) => setForm({ ...form, settings: { ...form.settings, redirectUrl: e.target.value } })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveToDatabase"
              checked={form.settings.saveToDatabase}
              onChange={(e) => setForm({ ...form, settings: { ...form.settings, saveToDatabase: e.target.checked } })}
              className="w-4 h-4 text-primary-600"
            />
            <label htmlFor="saveToDatabase" className="ml-2 text-sm text-gray-700">
              Save submissions to database
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => router.push('/admin/forms')}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
        >
          Back to Forms
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

