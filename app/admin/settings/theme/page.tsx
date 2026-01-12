/**
 * Theme Customizer - Global Style Manager
 * 全局样式管理器 - 主题定制器
 */

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface ThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

const defaultTheme: ThemeSettings = {
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    mono: 'Courier New',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
};

export default function ThemeCustomizerPage() {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchTheme();
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const fetchTheme = async () => {
    try {
      const res = await fetch('/api/admin/settings/theme');
      if (res.ok) {
        const data = await res.json();
        if (data.theme) {
          setTheme({ ...defaultTheme, ...data.theme });
        }
      }
    } catch (error) {
      console.error('Failed to fetch theme:', error);
    }
  };

  const applyTheme = (themeData: ThemeSettings) => {
    const root = document.documentElement;
    
    // Apply colors
    Object.entries(themeData.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply fonts
    Object.entries(themeData.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });

    // Apply spacing
    Object.entries(themeData.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply border radius
    Object.entries(themeData.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });

      if (res.ok) {
        toast.success('Theme saved successfully');
      } else {
        toast.error('Failed to save theme');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default theme?')) {
      setTheme(defaultTheme);
      toast.success('Theme reset to default');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Theme Customizer</h1>
          <p className="text-gray-600 mt-2">Customize your website's colors, fonts, and spacing</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              previewMode
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {previewMode ? 'Exit Preview' : 'Preview'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Theme'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Colors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Colors</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(theme.colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        setTheme({
                          ...theme,
                          colors: { ...theme.colors, [key]: e.target.value },
                        })
                      }
                      className="w-16 h-10 border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setTheme({
                          ...theme,
                          colors: { ...theme.colors, [key]: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Fonts</h2>
            <div className="space-y-4">
              {Object.entries(theme.fonts).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key} Font
                  </label>
                  <select
                    value={value}
                    onChange={(e) =>
                      setTheme({
                        ...theme,
                        fonts: { ...theme.fonts, [key]: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Monaco">Monaco</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Spacing</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(theme.spacing).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setTheme({
                        ...theme,
                        spacing: { ...theme.spacing, [key]: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="1rem"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Border Radius</h2>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(theme.borderRadius).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setTheme({
                        ...theme,
                        borderRadius: { ...theme.borderRadius, [key]: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="0.375rem"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
            <div className="space-y-4">
              {/* Button Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Buttons</h3>
                <div className="space-y-2">
                  <button
                    className="w-full px-4 py-2 rounded-lg font-semibold text-white"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="w-full px-4 py-2 rounded-lg font-semibold text-white"
                    style={{ backgroundColor: theme.colors.secondary }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>

              {/* Text Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Typography</h3>
                <div style={{ color: theme.colors.text }}>
                  <h4 style={{ fontFamily: theme.fonts.heading }} className="text-lg font-bold mb-1">
                    Heading Text
                  </h4>
                  <p style={{ fontFamily: theme.fonts.body, color: theme.colors.textSecondary }}>
                    Body text with secondary color
                  </p>
                </div>
              </div>

              {/* Card Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Card</h3>
                <div
                  className="p-4"
                  style={{
                    backgroundColor: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                  }}
                >
                  <p style={{ color: theme.colors.text }}>Card content preview</p>
                </div>
              </div>

              {/* Status Colors */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Status Colors</h3>
                <div className="space-y-2">
                  <div className="p-2 rounded" style={{ backgroundColor: `${theme.colors.success}20` }}>
                    <span style={{ color: theme.colors.success }}>Success</span>
                  </div>
                  <div className="p-2 rounded" style={{ backgroundColor: `${theme.colors.warning}20` }}>
                    <span style={{ color: theme.colors.warning }}>Warning</span>
                  </div>
                  <div className="p-2 rounded" style={{ backgroundColor: `${theme.colors.error}20` }}>
                    <span style={{ color: theme.colors.error }}>Error</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

