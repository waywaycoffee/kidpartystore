/**
 * 编辑产品页面
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  theme: string;
  category: string;
  stock: number;
  status: string;
  attributes: {
    ageRange?: string;
    size?: string;
    material?: string;
    certification?: string;
  };
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    images: [] as string[],
    videoUrl: '',
    theme: '',
    category: 'themePackages',
    stock: '0',
    status: 'draft',
    attributes: {
      ageRange: '',
      size: '',
      material: '',
      certification: '',
    },
    variants: [] as Array<{
      id: string;
      attributes: Array<{ name: string; value: string }>;
      price: number;
      stock: number;
      sku?: string;
      image?: string;
    }>,
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          const product = data.product as Product;
          setFormData({
            name: product.name || '',
            price: product.price?.toString() || '',
            description: product.description || '',
            image: product.image || '',
            theme: product.theme || '',
            category: product.category || 'themePackages',
            stock: product.stock?.toString() || '0',
            status: product.status || 'draft',
            attributes: {
              ageRange: product.attributes?.ageRange || '',
              size: product.attributes?.size || '',
              material: product.attributes?.material || '',
              certification: product.attributes?.certification || '',
            },
            videoUrl: (product as any).videoUrl || '',
            variants: (product as any).variants || [],
          });
        } else {
          toast.error('产品不存在');
          router.push('/admin/products');
        }
      } catch (error) {
        toast.error('加载产品失败');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          // 确保images数组正确保存
          images: formData.images.length > 0 ? formData.images : [formData.image],
        }),
      });

      if (res.ok) {
        toast.success('产品更新成功');
        router.push('/admin/products');
      } else {
        const error = await res.json();
        toast.error(error.error || '更新失败');
      }
    } catch (error) {
      toast.error('更新失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">编辑产品</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* 基本信息 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">基本信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品名称 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  价格 (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  库存 *
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品主图片 URL *
              </label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) => {
                  const newImage = e.target.value;
                  setFormData({ 
                    ...formData, 
                    image: newImage,
                    // 如果images数组为空，自动添加主图片
                    images: formData.images.length === 0 && newImage ? [newImage] : formData.images
                  });
                }}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品多图片管理
              </label>
              <p className="text-xs text-gray-500 mb-2">
                添加多个产品图片，支持图片轮播展示
              </p>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image2.jpg"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newImageUrl) {
                      e.preventDefault();
                      setFormData({
                        ...formData,
                        images: [...formData.images, newImageUrl],
                      });
                      setNewImageUrl('');
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newImageUrl) {
                      setFormData({
                        ...formData,
                        images: [...formData.images, newImageUrl],
                      });
                      setNewImageUrl('');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  添加
                </button>
              </div>
              
              {/* 图片列表 */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            主图
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index);
                            setFormData({ ...formData, images: newImages });
                          }}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (index > 0) {
                              const newImages = [...formData.images];
                              [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
                              setFormData({ ...formData, images: newImages, image: newImages[0] });
                            }
                          }}
                          className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={index === 0}
                        >
                          设为主图
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    共 {formData.images.length} 张图片，第一张为主图
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品介绍视频 URL
              </label>
              <input
                type="url"
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="YouTube/Vimeo链接或直接视频URL (如: https://youtube.com/watch?v=...)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                支持 YouTube、Vimeo 或直接视频文件链接
              </p>
            </div>
          </div>
        </div>

        {/* 分类和主题 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">分类和主题</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分类 *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="themePackages">主题套餐</option>
                <option value="balloons">气球</option>
                <option value="decorations">装饰</option>
                <option value="tableware">餐具</option>
                <option value="interactiveProps">互动道具</option>
                <option value="personalized">个性化定制</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                主题
              </label>
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                placeholder="如: Disney, Unicorn"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 产品属性 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">产品属性</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                适用年龄
              </label>
              <input
                type="text"
                value={formData.attributes.ageRange}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attributes: { ...formData.attributes, ageRange: e.target.value },
                  })
                }
                placeholder="如: 3-8 years"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                尺寸
              </label>
              <input
                type="text"
                value={formData.attributes.size}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attributes: { ...formData.attributes, size: e.target.value },
                  })
                }
                placeholder="如: 12-inch"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                材质
              </label>
              <input
                type="text"
                value={formData.attributes.material}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attributes: { ...formData.attributes, material: e.target.value },
                  })
                }
                placeholder="如: Latex, Cardboard"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                认证
              </label>
              <input
                type="text"
                value={formData.attributes.certification}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attributes: { ...formData.attributes, certification: e.target.value },
                  })
                }
                placeholder="如: ASTM, EN 71"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 状态 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            状态
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">草稿</option>
            <option value="active">已发布</option>
            <option value="archived">已归档</option>
          </select>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end space-x-4">
          <Link
            href={`/admin/products/${productId}/edit/seo`}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            SEO Settings
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存更改'}
          </button>
        </div>
      </form>
    </div>
  );
}

