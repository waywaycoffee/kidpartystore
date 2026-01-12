/**
 * 图片管理页面
 * 
 * 功能：
 * - 图片上传
 * - 图片预览
 * - 图片删除
 * - 图片替换（用于网站界面）
 */

'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

interface ImageFile {
  id: string;
  url: string;
  name: string;
  size: number;
  uploadedAt: string;
  type: 'product' | 'banner' | 'logo' | 'other';
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<'product' | 'banner' | 'logo' | 'other'>(
    'product'
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      try {
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append('file', file);

          const res = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();

          if (data.success) {
            const newImage: ImageFile = {
              id: Date.now().toString(),
              url: data.url,
              name: file.name,
              size: file.size,
              uploadedAt: new Date().toISOString(),
              type: selectedType,
            };

            setImages((prev) => [newImage, ...prev]);
          } else {
            toast.error(`上传失败: ${data.error || 'Unknown error'}`);
          }
        }
        toast.success(`成功上传 ${acceptedFiles.length} 张图片`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('上传失败');
      } finally {
        setUploading(false);
      }
    },
    [selectedType]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: true,
  });

  const handleDelete = (id: string) => {
    if (!confirm('确定要删除这张图片吗？')) return;
    setImages((prev) => prev.filter((img) => img.id !== id));
    toast.success('图片已删除');
  };

  const handleSetAsBanner = (imageUrl: string) => {
    // 保存为网站横幅（实际应调用 API）
    localStorage.setItem('siteBanner', imageUrl);
    toast.success('已设置为网站横幅');
  };

  const handleSetAsLogo = (imageUrl: string) => {
    // 保存为网站 Logo（实际应调用 API）
    localStorage.setItem('siteLogo', imageUrl);
    toast.success('已设置为网站 Logo');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">图片管理</h1>
        <select
          value={selectedType}
          onChange={(e) =>
            setSelectedType(e.target.value as 'product' | 'banner' | 'logo' | 'other')
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="product">产品图片</option>
          <option value="banner">横幅图片</option>
          <option value="logo">Logo</option>
          <option value="other">其他</option>
        </select>
      </div>

      {/* 上传区域 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {uploading ? (
          <p className="text-gray-600">上传中...</p>
        ) : isDragActive ? (
          <p className="text-blue-600">松开以上传图片</p>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              拖拽图片到这里，或点击选择文件
            </p>
            <p className="text-sm text-gray-500">
              支持 PNG, JPG, JPEG, GIF, WEBP
            </p>
          </>
        )}
      </div>

      {/* 图片网格 */}
      {images.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">暂无图片</h3>
          <p className="text-gray-600">上传您的第一张图片</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden group relative"
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    {selectedType === 'banner' && (
                      <button
                        onClick={() => handleSetAsBanner(image.url)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        设为横幅
                      </button>
                    )}
                    {selectedType === 'logo' && (
                      <button
                        onClick={() => handleSetAsLogo(image.url)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        设为Logo
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{image.name}</p>
                <p className="text-xs text-gray-400">
                  {(image.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

