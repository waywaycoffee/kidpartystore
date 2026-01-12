/**
 * 产品详情页
 * 
 * 跨境适配说明：
 * - 多货币价格显示
 * - 个性化定制功能（姓名横幅、照片背景板）
 * - 商品属性详细展示（尺寸、材质、认证）
 * - 配送时效和关税提示
 * - 用户评价展示（带实拍图）
 * 
 * 新手注意：
 * - 个性化定制需要预览功能
 * - 定制商品需要额外处理时间（7-10天）
 * - 图片轮播应支持放大查看
 * - 库存检查应在添加到购物车前进行
 */

'use client';

import ImageCarousel from '@/components/ImageCarousel';
import ProductReviews from '@/components/ProductReviews';
import VideoPlayer from '@/components/VideoPlayer';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { CartItem } from '@/store/slices/cartSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { selectCurrentCurrency } from '@/store/slices/currencySlice';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
// ProductStructuredData is handled in layout.tsx

// 默认产品数据（作为fallback）
const defaultProductData = {
  id: '1',
  name: 'Disney Princess Party Package',
  price: 89.99,
  images: [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
  ],
  theme: 'disney',
  category: 'themePackages',
  description:
    'Complete Disney Princess party package including banner, balloons, tableware, and decorations. Perfect for ages 3-8.',
  attributes: {
    size: 'Standard Party Size (16 guests)',
    material: 'Premium Cardboard & Latex',
    certification: ['ASTM', 'EN 71'],
    ageRange: '3-8 years',
    includes: [
      '1x Welcome Banner',
      '20x Latex Balloons',
      '16x Tableware Set',
      '10x Decorative Items',
    ],
  },
  estimatedDelivery: 7,
  freeShipping: true,
  inStock: true,
  stockCount: 15,
  videoUrl: '',
  // 个性化定制选项
  customizationOptions: {
    available: true,
    types: ['name', 'photo', 'text'],
    processingTime: '7-10 business days',
  },
};

interface ProductData {
  id: string;
  name: string;
  price: number;
  images: string[];
  videoUrl?: string;
  theme: string;
  category: string;
  description: string;
  attributes: {
    size: string;
    material: string;
    certification: string[];
    ageRange: string;
    includes: string[];
  };
  estimatedDelivery: number;
  freeShipping: boolean;
  inStock: boolean;
  stockCount: number;
  customizationOptions: {
    available: boolean;
    types: string[];
    processingTime: string;
  };
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentCurrency = useAppSelector(selectCurrentCurrency);
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [customization, setCustomization] = useState<{
    type: 'name' | 'photo' | 'text';
    value: string;
  } | null>(null);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (res.ok && data.product) {
          const product = data.product;
          // 确保images数组存在
          const productImages = product.images && product.images.length > 0 
            ? product.images 
            : (product.image ? [product.image] : []);
          
          setProductData({
            ...defaultProductData,
            ...product,
            images: productImages,
            videoUrl: (product as { videoUrl?: string }).videoUrl || '',
          } as ProductData);
        } else {
          // Use default data if API fails
          setProductData(defaultProductData);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        // Use default data if API fails
        setProductData(defaultProductData);
      } finally {
        setLoadingProduct(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loadingProduct) {
    return <div className="text-center py-8">Loading product...</div>;
  }

  if (!productData) {
    return <div className="text-center py-8 text-red-500">Product not found.</div>;
  }

  // 货币转换
  const convertedPrice = productData ? convertCurrency(productData.price, 'USD', currentCurrency) : 0;
  const formattedPrice = productData ? formatCurrency(convertedPrice, currentCurrency) : '$0.00';

  const handleAddToCart = () => {
    if (!productData) return;
    
    if (!productData.inStock) {
      toast.error('Product is out of stock');
      return;
    }

    const cartItem: CartItem = {
      id: productData.id,
      name: productData.name,
      price: productData.price,
      quantity,
      image: productData.images[0],
      theme: productData.theme,
      category: productData.category,
      attributes: productData.attributes,
      customization: customization || undefined,
    };

    dispatch(addToCart(cartItem));
    toast.success(`${productData.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images/Video */}
            <div>
              {/* Video or Image Carousel */}
              {productData.videoUrl && productData.videoUrl.trim() !== '' ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Product Video</h3>
                  <VideoPlayer
                    videoUrl={productData.videoUrl}
                    title={`${productData.name} - Product Introduction`}
                    autoplay={true}
                    className="mb-4"
                  />
                  {/* Show images below video if available */}
                  {productData.images && productData.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">Product Images</h4>
                      <ImageCarousel
                        images={productData.images}
                        alt={productData.name}
                        autoPlay={false}
                        showDots={true}
                        showArrows={true}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <ImageCarousel
                    images={productData.images}
                    alt={productData.name}
                    autoPlay={true}
                    autoPlayInterval={4000}
                    showDots={true}
                    showArrows={true}
                  />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{productData.name}</h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary-600">
                  {formattedPrice}
                </span>
                {currentCurrency !== 'USD' && (
                  <span className="text-gray-500 ml-2">
                    (≈ ${productData.price.toFixed(2)} USD)
                  </span>
                )}
              </div>

              {/* Attributes */}
              <div className="mb-6 space-y-2">
                <div>
                  <span className="font-semibold">Age Range: </span>
                  {productData.attributes.ageRange}
                </div>
                <div>
                  <span className="font-semibold">Size: </span>
                  {productData.attributes.size}
                </div>
                <div>
                  <span className="font-semibold">Material: </span>
                  {productData.attributes.material}
                </div>
                <div>
                  <span className="font-semibold">Certification: </span>
                  {productData.attributes.certification.join(', ')}
                </div>
              </div>

              {/* Includes */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Package Includes:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {productData.attributes.includes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Customization */}
              {productData.customizationOptions?.available && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Personalization Options</h3>
                  <select
                    value={customization?.type || ''}
                    onChange={(e) =>
                      setCustomization({
                        type: e.target.value as 'name' | 'photo' | 'text',
                        value: '',
                      })
                    }
                    className="input-field mb-2"
                  >
                    <option value="">Select customization type</option>
                    <option value="name">Add Name</option>
                    <option value="photo">Add Photo</option>
                    <option value="text">Custom Text</option>
                  </select>
                  {customization && (
                    <input
                      type="text"
                      placeholder={
                        customization.type === 'name'
                          ? 'Enter name'
                          : customization.type === 'photo'
                            ? 'Upload photo URL'
                            : 'Enter custom text'
                      }
                      value={customization.value}
                      onChange={(e) =>
                        setCustomization({ ...customization, value: e.target.value })
                      }
                      className="input-field"
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Processing time: {productData.customizationOptions.processingTime}
                  </p>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Quantity:</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border rounded-lg hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(productData.stockCount, quantity + 1))
                    }
                    className="w-10 h-10 border rounded-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                  <span className="text-gray-500">
                    {productData.stockCount} in stock
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!productData.inStock}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.addToCart')}
                </button>
                <button className="flex-1 btn-secondary">
                  {t('common.buyNow')}
                </button>
              </div>

              {/* Shipping Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span>🚚</span>
                  <span className="font-semibold">
                    {t('common.estimatedDelivery')}: {productData.estimatedDelivery}{' '}
                    {t('common.days')}
                  </span>
                </div>
                {productData.freeShipping && (
                  <div className="text-green-600 font-semibold">
                    ✓ {t('common.freeShipping')} on orders over $50
                  </div>
                )}
                <p className="text-xs text-gray-600 mt-2">
                  * International shipping may be subject to customs duties
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-8 border-t">
            <h2 className="text-2xl font-bold mb-4">Product Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">{productData.description}</p>
              
              {/* SEO-optimized content sections */}
              {productData.attributes && (
                <>
                  <h3 className="text-xl font-semibold mt-6 mb-3">What's Included</h3>
                  {productData.attributes.includes && (
                    <ul className="list-disc list-inside space-y-2 mb-4">
                      {productData.attributes.includes.map((item: string, index: number) => (
                        <li key={index} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  )}
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Perfect For</h3>
                  <p className="text-gray-700 mb-4">
                    This {productData.theme ? `${productData.theme} ` : ''}party package is ideal for {productData.attributes.ageRange || 'children'}.
                    {productData.attributes.size && ` Designed for ${productData.attributes.size}.`}
                  </p>
                  
                  {productData.attributes.certification && productData.attributes.certification.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Safety & Certification</h3>
                      <p className="text-gray-700 mb-4">
                        All products are certified safe with {productData.attributes.certification.join(' and ')} standards,
                        ensuring your child's safety during the celebration.
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <ProductReviews productId={params.id} />
        </div>
      </div>
    </div>
  );
}

