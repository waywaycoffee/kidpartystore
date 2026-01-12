/**
 * 产品卡片组件
 * 
 * 跨境适配说明：
 * - 价格显示支持多货币
 * - 显示配送时效（跨境物流）
 * - 主题标签展示
 * - 安全认证标识
 * 
 * 新手注意：
 * - 图片应使用 Next.js Image 组件优化加载
 * - 价格转换应在服务端完成，避免客户端汇率不一致
 * - 商品图片应支持懒加载（提升性能）
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { selectCurrentCurrency } from '@/store/slices/currencySlice';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import type { CartItem } from '@/store/slices/cartSlice';
import ImageCarousel from '@/components/ImageCarousel';
import toast from 'react-hot-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number; // USD 基准价格
  image: string;
  images?: string[]; // 多图片支持
  theme?: string;
  category?: string;
  // 商品属性
  attributes?: {
    size?: string;
    material?: string;
    certification?: string[];
    ageRange?: string;
  };
  // 配送信息
  estimatedDelivery?: number; // 天数
  freeShipping?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  images,
  theme,
  category,
  attributes,
  estimatedDelivery,
  freeShipping,
}: ProductCardProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentCurrency = useAppSelector(selectCurrentCurrency);
  
  // 使用images数组或单个image
  const productImages = images && images.length > 0 ? images : [image];

  // 货币转换
  const convertedPrice = convertCurrency(price, 'USD', currentCurrency);
  const formattedPrice = formatCurrency(convertedPrice, currentCurrency);

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id,
      name,
      price,
      quantity: 1,
      image,
      theme,
      category,
      attributes,
    };

    dispatch(addToCart(cartItem));
    toast.success(`${name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/products/${id}`}>
        <div className="relative h-64 w-full overflow-hidden">
          {productImages.length > 1 ? (
            <ImageCarousel
              images={productImages}
              alt={name}
              autoPlay={true}
              autoPlayInterval={3000}
              showDots={false}
              showArrows={false}
              className="h-full"
            />
          ) : (
            <Image
              src={productImages[0]}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {theme && (
            <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
              {t(`themes.${theme}`) || theme}
            </div>
          )}
          {freeShipping && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
              {t('common.freeShipping')}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600">
            {name}
          </h3>
        </Link>

        {/* 商品属性展示 */}
        {attributes && (
          <div className="text-xs text-gray-600 mb-2 space-y-1">
            {attributes.ageRange && (
              <div>Ages: {attributes.ageRange}</div>
            )}
            {attributes.size && <div>Size: {attributes.size}</div>}
            {attributes.certification && attributes.certification.length > 0 && (
              <div className="flex items-center space-x-1">
                <span>✓</span>
                <span>{attributes.certification.join(', ')} Certified</span>
              </div>
            )}
          </div>
        )}

        {/* 配送时效 */}
        {estimatedDelivery && (
          <div className="text-xs text-gray-500 mb-2">
            {t('common.estimatedDelivery')}: {estimatedDelivery}{' '}
            {t('common.days')}
          </div>
        )}

        {/* 价格和操作按钮 */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              {formattedPrice}
            </span>
            {currentCurrency !== 'USD' && (
              <span className="text-xs text-gray-500 ml-1">
                (≈ ${price.toFixed(2)} USD)
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            {t('common.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}

