/**
 * Product Recommendations Component
 * 产品推荐组件
 */

'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  theme?: string;
}

interface ProductRecommendationsProps {
  type?: 'popular' | 'behavior' | 'category';
  category?: string;
  productId?: string;
  userEmail?: string;
  limit?: number;
  title?: string;
}

export default function ProductRecommendations({
  type = 'popular',
  category,
  productId,
  userEmail,
  limit = 8,
  title,
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [type, category, productId, userEmail, limit]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type,
        limit: limit.toString(),
      });

      if (category) params.append('category', category);
      if (productId) params.append('productId', productId);
      if (userEmail) params.append('userEmail', userEmail);

      const res = await fetch(`/api/recommendations?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading recommendations...</div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const displayTitle = title || (type === 'popular' ? 'Popular Products' : type === 'behavior' ? 'You May Also Like' : 'Related Products');

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{displayTitle}</h2>
        <Link
          href="/products"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

