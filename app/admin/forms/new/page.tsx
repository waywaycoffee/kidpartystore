/**
 * Form Builder - Create New Form
 * 创建新表单页面
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormBuilder from '@/components/FormBuilder';
import toast from 'react-hot-toast';

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
  options?: string[];
  conditional?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains';
    value: string;
  };
}

interface FormSettings {
  emailNotification?: string;
  webhookUrl?: string;
  saveToDatabase: boolean;
  redirectUrl?: string;
  successMessage?: string;
}

export default function NewFormPage() {
  const router = useRouter();
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [settings, setSettings] = useState<FormSettings>({
    saveToDatabase: true,
    successMessage: 'Thank you for your submission!',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formName.trim()) {
      toast.error('Please enter a form name');
      return;
    }

    if (fields.length === 0) {
      toast.error('Please add at least one field');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          description: formDescription,
          fields,
          settings,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('Form created successfully');
        router.push(`/admin/forms/${data.form.id}/edit`);
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to create form');
      }
    } catch (error) {
      console.error('Error creating form:', error);
      toast.error('Failed to create form');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create New Form</h1>
        <p className="text-gray-600">Build a custom form with drag-and-drop fields</p>
      </div>

      {/* Form Basic Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Form Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Name *
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g., Contact Form, Newsletter Signup"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Brief description of the form's purpose"
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Form Builder */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Form Fields</h2>
        <FormBuilder fields={fields} setFields={setFields} />
      </div>

      {/* Form Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Form Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Notification
            </label>
            <input
              type="email"
              value={settings.emailNotification || ''}
              onChange={(e) => setSettings({ ...settings, emailNotification: e.target.value })}
              placeholder="Email to receive form submissions"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              value={settings.webhookUrl || ''}
              onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
              placeholder="https://example.com/webhook"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Success Message
            </label>
            <input
              type="text"
              value={settings.successMessage || ''}
              onChange={(e) => setSettings({ ...settings, successMessage: e.target.value })}
              placeholder="Message shown after successful submission"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Redirect URL (optional)
            </label>
            <input
              type="url"
              value={settings.redirectUrl || ''}
              onChange={(e) => setSettings({ ...settings, redirectUrl: e.target.value })}
              placeholder="Redirect to this URL after submission"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveToDatabase"
              checked={settings.saveToDatabase}
              onChange={(e) => setSettings({ ...settings, saveToDatabase: e.target.checked })}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
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
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Create Form'}
        </button>
      </div>
    </div>
  );
}

