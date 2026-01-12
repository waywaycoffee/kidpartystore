/**
 * 主题分类页
 * 
 * 跨境适配说明：
 * - A-Z 主题导航
 * - 主题筛选和搜索
 * - 套餐价格对比（单品总价 vs 套餐价）
 * - 支持定制加购
 * 
 * 新手注意：
 * - 主题数据应从 API 获取
 * - 搜索功能应支持多语言关键词
 * - 价格对比功能需要计算单品总价
 */

'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '@/components/ProductCard';

// 示例主题数据
const themes = [
  { id: 'disney', name: 'Disney', count: 45 },
  { id: 'marvel', name: 'Marvel', count: 32 },
  { id: 'peppaPig', name: 'Peppa Pig', count: 28 },
  { id: 'unicorn', name: 'Unicorn', count: 67 },
  { id: 'dinosaur', name: 'Dinosaur', count: 54 },
  { id: 'mermaid', name: 'Mermaid', count: 41 },
  { id: 'princess', name: 'Princess', count: 58 },
  { id: 'superhero', name: 'Superhero', count: 39 },
];

// 示例产品数据
const themeProducts = [
  {
    id: '1',
    name: 'Disney Princess Complete Party Package',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
    theme: 'disney',
    category: 'themePackages',
    attributes: {
      ageRange: '3-8 years',
      certification: ['ASTM', 'EN 71'],
    },
    estimatedDelivery: 7,
    freeShipping: true,
    // 套餐信息
    packageInfo: {
      items: ['Banner', 'Balloons', 'Tableware', 'Decorations'],
      individualPrice: 120.99, // 单品总价
      savings: 31.0, // 节省金额
    },
  },
  {
    id: '2',
    name: 'Unicorn Magic Party Set',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
    theme: 'unicorn',
    category: 'themePackages',
    attributes: {
      ageRange: '4-10 years',
      certification: ['ASTM'],
    },
    estimatedDelivery: 5,
    freeShipping: true,
    packageInfo: {
      items: ['Balloon Arch', 'Banner', 'Tableware', 'Photo Props'],
      individualPrice: 95.99,
      savings: 26.0,
    },
  },
];

export default function ThemesPage() {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = themeProducts.filter((product) => {
    const matchesTheme = !selectedTheme || product.theme === selectedTheme;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {t('categories.themePackages')}
          </h1>
          <p className="text-gray-600">
            Choose from our wide selection of themed party packages
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 input-field"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTheme(null)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !selectedTheme
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Themes
            </button>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedTheme === theme.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t(`themes.${theme.id}`) || theme.name} ({theme.count})
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <ProductCard {...product} />
              {/* 套餐价格对比 */}
              {product.packageInfo && (
                <div className="p-4 bg-green-50 border-t">
                  <div className="text-sm text-gray-600 mb-1">
                    Individual items: ${product.packageInfo.individualPrice.toFixed(2)}
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    Save ${product.packageInfo.savings.toFixed(2)} with package!
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Includes: {product.packageInfo.items.join(', ')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

