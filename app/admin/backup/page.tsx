/**
 * Backup Management Page
 * WordPress UpdraftPlus equivalent
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Backup {
  id: string;
  timestamp: string;
  fileCount: number;
  totalSize: number;
}

export default function BackupPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/backup');
      const data = await res.json();
      setBackups(data.backups || []);
    } catch (error) {
      console.error('Failed to fetch backups:', error);
      toast.error('Failed to load backups');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/admin/backup', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Backup created successfully');
        fetchBackups();
      } else {
        toast.error('Failed to create backup');
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setCreating(false);
    }
  };

  const restoreBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to restore this backup? This will overwrite current data.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/backup/${backupId}`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Backup restored successfully. ${data.restoredFiles} files restored.`);
        fetchBackups();
      } else {
        toast.error('Failed to restore backup');
      }
    } catch (error) {
      console.error('Failed to restore backup:', error);
      toast.error('Failed to restore backup');
    }
  };

  const deleteBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to delete this backup?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/backup/${backupId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Backup deleted successfully');
        fetchBackups();
      } else {
        toast.error('Failed to delete backup');
      }
    } catch (error) {
      console.error('Failed to delete backup:', error);
      toast.error('Failed to delete backup');
    }
  };

  const downloadBackup = (backupId: string) => {
    window.open(`/api/admin/backup/${backupId}/download`, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Backup Management</h1>
        <button
          onClick={createBackup}
          disabled={creating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'Create Backup'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Backup History</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading backups...</div>
        ) : backups.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No backups found. Create your first backup to get started.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Files
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Size
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.map((backup) => (
                <tr key={backup.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(backup.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backup.fileCount} files
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFileSize(backup.totalSize)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => restoreBackup(backup.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => downloadBackup(backup.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => deleteBackup(backup.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Backup Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Backup Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Create backups regularly before making major changes</li>
            <li>• Backups include all products, orders, themes, and settings</li>
            <li>• You can download backups as JSON files for external storage</li>
            <li>• Restoring a backup will overwrite current data</li>
          </ul>
        </div>

        {/* Import/Export */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold mb-4">Data Import/Export</h3>
          <div className="space-y-3">
            <button
              onClick={() => {
                window.open('/api/admin/export', '_blank');
                toast.success('Export started');
              }}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Export All Data
            </button>
            <p className="text-xs text-gray-500">
              Download all data as JSON file for migration or backup
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

