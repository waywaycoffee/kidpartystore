/**
 * Category Collection Page
 */

'use client';

import ProductBundle from '@/components/ProductBundle';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subCategory?: string;
}

const categoryInfo: Record<string, { name: string; nameEn: string; description: string }> = {
  balloons: {
    name: 'Balloons',
    nameEn: 'Balloons',
    description: 'Various themed and colored balloons to add color to your party',
  },
  decorations: {
    name: 'Decorations',
    nameEn: 'Decorations',
    description: 'Beautiful party decorations to create the perfect atmosphere',
  },
  tableware: {
    name: 'Tableware',
    nameEn: 'Tableware',
    description: 'Themed tableware sets to make your table more elegant',
  },
  'games-gifts': {
    name: 'Games & Gifts',
    nameEn: 'Games & Gifts',
    description: 'Fun party games and beautiful gifts',
  },
  pinatas: {
    name: 'Piñatas',
    nameEn: 'Piñatas',
    description: 'Traditional party piñatas to add fun to your celebration',
  },
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const category = categoryInfo[params.slug] || {
    name: params.slug,
    nameEn: params.slug,
    description: '',
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${params.slug}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group by subcategory
  const productsBySubCategory: Record<string, Product[]> = {};
  products.forEach((product) => {
    const subCategory = product.subCategory || 'Other';
    if (!productsBySubCategory[subCategory]) {
      productsBySubCategory[subCategory] = [];
    }
    productsBySubCategory[subCategory].push(product);
  });

  // Generate bundle recommendation (example: first 4 products as a bundle)
  const bundleProducts = products.slice(0, 4);
  const bundlePrice = bundleProducts.length > 0
    ? bundleProducts.reduce((sum, p) => sum + p.price, 0) * 0.9 // 10% discount
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{category.nameEn}</h1>
          <p className="text-lg text-gray-600">{category.description}</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No products available</div>
        ) : (
          <>
            {/* Product Grid (Grouped by Subcategory) */}
            {Object.keys(productsBySubCategory).length > 0 ? (
              <div className="space-y-12 mb-12">
                {Object.entries(productsBySubCategory).map(([subCategory, subProducts]) => (
                  <div key={subCategory}>
                    <h2 className="text-2xl font-semibold mb-4 capitalize">{subCategory}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {subProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}

            {/* Bundle Recommendation */}
            {bundleProducts.length >= 2 && (
              <section>
                <ProductBundle
                  title="Frequently Bought Together"
                  products={bundleProducts}
                  bundlePrice={bundlePrice}
                />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

