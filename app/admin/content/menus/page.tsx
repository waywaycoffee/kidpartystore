/**
 * Menus Management Page
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  type: 'page' | 'external' | 'anchor';
  children?: MenuItem[];
  order?: number;
}

interface Menu {
  id: string;
  name: string;
  location: 'header' | 'footer' | 'sidebar';
  items: MenuItem[];
  updatedAt: string;
}

export default function MenusPage() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    label: '',
    url: '',
    type: 'page' as 'page' | 'external' | 'anchor',
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/menus');
      if (res.ok) {
        const data = await res.json();
        setMenus(data.menus || []);
      }
    } catch (error) {
      toast.error('Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setShowForm(false);
  };

  const handleAddMenuItem = () => {
    if (!selectedMenu || !newMenuItem.label || !newMenuItem.url) {
      toast.error('Please fill in label and URL');
      return;
    }

    const menuItem: MenuItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      label: newMenuItem.label,
      url: newMenuItem.url,
      type: newMenuItem.type,
      order: selectedMenu.items.length,
    };

    const updatedMenu = {
      ...selectedMenu,
      items: [...selectedMenu.items, menuItem],
    };

    handleUpdateMenu(updatedMenu);
    setNewMenuItem({ label: '', url: '', type: 'page' });
  };

  const handleRemoveMenuItem = (itemId: string) => {
    if (!selectedMenu) return;

    const removeItem = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter((item) => item.id !== itemId)
        .map((item) => ({
          ...item,
          children: item.children ? removeItem(item.children) : undefined,
        }));
    };

    const updatedMenu = {
      ...selectedMenu,
      items: removeItem(selectedMenu.items),
    };

    handleUpdateMenu(updatedMenu);
  };

  const handleUpdateMenu = async (menu: Menu) => {
    try {
      const res = await fetch(`/api/admin/menus/${menu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu),
      });

      if (res.ok) {
        toast.success('Menu updated successfully');
        fetchMenus();
        const data = await res.json();
        setSelectedMenu(data.menu);
      } else {
        toast.error('Failed to update menu');
      }
    } catch (error) {
      toast.error('Failed to update menu');
    }
  };

  const handleDelete = async (menuId: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;

    try {
      const res = await fetch(`/api/admin/menus/${menuId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Menu deleted successfully');
        setSelectedMenu(null);
        fetchMenus();
      } else {
        toast.error('Failed to delete menu');
      }
    } catch (error) {
      toast.error('Failed to delete menu');
    }
  };

  const handleCreateMenu = async () => {
    const name = prompt('Enter menu name:');
    if (!name) return;

    const location = prompt('Enter menu location (header/footer/sidebar):') as 'header' | 'footer' | 'sidebar';
    if (!['header', 'footer', 'sidebar'].includes(location)) {
      toast.error('Invalid location. Must be header, footer, or sidebar');
      return;
    }

    try {
      const res = await fetch('/api/admin/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location, items: [] }),
      });

      if (res.ok) {
        toast.success('Menu created successfully');
        fetchMenus();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to create menu');
      }
    } catch (error) {
      toast.error('Failed to create menu');
    }
  };

  const renderMenuItems = (items: MenuItem[], level: number = 0) => {
    return items.map((item) => (
      <div key={item.id} className={`ml-${level * 4} border-l-2 border-gray-200 pl-4 mb-2`}>
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
          <div className="flex-1">
            <div className="font-medium">{item.label}</div>
            <div className="text-sm text-gray-500">{item.url}</div>
            <div className="text-xs text-gray-400">{item.type}</div>
          </div>
          <button
            onClick={() => handleRemoveMenuItem(item.id)}
            className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-900"
          >
            Remove
          </button>
        </div>
        {item.children && item.children.length > 0 && (
          <div className="mt-2">{renderMenuItems(item.children, level + 1)}</div>
        )}
      </div>
    ));
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
        <h1 className="text-3xl font-bold">Menus Management</h1>
        <button
          onClick={handleCreateMenu}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          New Menu
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Menus</h2>
            <div className="space-y-2">
              {menus.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => handleSelectMenu(menu)}
                  className={`w-full text-left p-3 rounded-lg ${
                    selectedMenu?.id === menu.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{menu.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{menu.location}</div>
                  <div className="text-xs text-gray-400">
                    {menu.items.length} item(s)
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Editor */}
        <div className="lg:col-span-2">
          {selectedMenu ? (
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{selectedMenu.name}</h2>
                  <p className="text-sm text-gray-500 capitalize">{selectedMenu.location}</p>
                </div>
                <button
                  onClick={() => handleDelete(selectedMenu.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Menu
                </button>
              </div>

              {/* Add Menu Item Form */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Add Menu Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label *
                    </label>
                    <input
                      type="text"
                      value={newMenuItem.label}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, label: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Menu item label"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL *
                    </label>
                    <input
                      type="text"
                      value={newMenuItem.url}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/page or https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={newMenuItem.type}
                      onChange={(e) =>
                        setNewMenuItem({ ...newMenuItem, type: e.target.value as 'page' | 'external' | 'anchor' })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="page">Page</option>
                      <option value="external">External Link</option>
                      <option value="anchor">Anchor</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleAddMenuItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>

              {/* Menu Items List */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Menu Items</h3>
                {selectedMenu.items.length === 0 ? (
                  <p className="text-gray-500">No menu items. Add items above.</p>
                ) : (
                  <div className="space-y-2">{renderMenuItems(selectedMenu.items)}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500">Select a menu to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

