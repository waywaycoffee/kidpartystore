/**
 * Form Renderer Component
 * 表单渲染组件 - 根据表单配置动态渲染表单
 */

'use client';

import { useState } from 'react';
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

interface Form {
  id: string;
  name: string;
  fields: FormField[];
  settings: {
    successMessage?: string;
    redirectUrl?: string;
  };
}

interface FormRendererProps {
  form: Form;
}

export default function FormRenderer({ form }: FormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/forms/${form.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || 'Form submitted successfully!');
        
        // Reset form
        setFormData({});

        // Redirect if configured
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        }
      } else {
        toast.error(result.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const shouldShowField = (field: FormField): boolean => {
    if (!field.conditional) return true;

    const { field: conditionalField, operator, value } = field.conditional;
    const fieldValue = formData[conditionalField];

    if (!fieldValue) return false;

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'notEquals':
        return fieldValue !== value;
      case 'contains':
        return String(fieldValue).includes(value);
      default:
        return true;
    }
  };

  const renderField = (field: FormField) => {
    if (!shouldShowField(field)) return null;

    const commonProps = {
      id: field.id,
      name: field.name,
      required: field.required,
      placeholder: field.placeholder,
      className: 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={formData[field.name] === option}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="mr-2"
                  required={field.required}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  name={field.name}
                  value={option}
                  checked={formData[field.name]?.includes(option) || false}
                  onChange={(e) => {
                    const current = formData[field.name] || [];
                    if (e.target.checked) {
                      setFormData({ ...formData, [field.name]: [...current, option] });
                    } else {
                      setFormData({ ...formData, [field.name]: current.filter((v: string) => v !== option) });
                    }
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            {...commonProps}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // In a real app, you'd upload the file first
                setFormData({ ...formData, [field.name]: file.name });
              }
            }}
          />
        );

      default:
        return (
          <input
            type={field.type}
            {...commonProps}
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            min={field.validation?.min}
            max={field.validation?.max}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
            pattern={field.validation?.pattern}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">{form.name}</h2>

      {form.fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-600 ml-1">*</span>}
          </label>
          {renderField(field)}
          {field.validation && (
            <p className="text-xs text-gray-500">
              {field.validation.minLength && `Min: ${field.validation.minLength} characters`}
              {field.validation.maxLength && ` Max: ${field.validation.maxLength} characters`}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

