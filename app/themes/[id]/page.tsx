/**
 * Theme Detail Page
 */

'use client';

import ProductCard from '@/components/ProductCard';
import ThemeHeader from '@/components/ThemeHeader';
import ThemePackageCard from '@/components/ThemePackageCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Theme {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  bannerImage?: string;
  ageRange: { min: number; max: number };
  gender: 'boy' | 'girl' | 'neutral';
  recommendedGuests?: number;
  recommendedVenue?: string;
  packages?: Array<{
    id: string;
    name: string;
    level: 'basic' | 'standard' | 'premium';
    price: number;
    items: Array<{ productId: string; quantity: number; name: string }>;
    savings?: number;
    image?: string;
  }>;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ThemeDetailPage({ params }: { params: { id: string } }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [relatedThemes, setRelatedThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThemeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchThemeData = async () => {
    setLoading(true);
    try {
      // Fetch theme details
      const themeRes = await fetch(`/api/themes/${params.id}`);
      const themeData = await themeRes.json();
      setTheme(themeData.theme);

      // Fetch products for this theme
      const productsRes = await fetch(`/api/products?theme=${params.id}`);
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);

      // Fetch related themes
      const relatedRes = await fetch(
        `/api/themes?gender=${themeData.theme?.gender || 'neutral'}`
      );
      const relatedData = await relatedRes.json();
      setRelatedThemes(
        (relatedData.themes || []).filter((t: Theme) => t.id !== params.id).slice(0, 4)
      );
    } catch (error) {
      console.error('Failed to fetch theme data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Theme Not Found</h2>
          <Link href="/themes" className="btn-primary">
            Back to Themes
          </Link>
        </div>
      </div>
    );
  }

  // Group products by category
  const productsByCategory: Record<string, Product[]> = {};
  products.forEach((product) => {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = [];
    }
    productsByCategory[product.category].push(product);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Theme Header */}
        <ThemeHeader
          name={theme.name}
          nameEn={theme.nameEn}
          description={theme.description}
          descriptionEn={theme.descriptionEn}
          bannerImage={theme.bannerImage}
          ageRange={theme.ageRange}
          gender={theme.gender}
          recommendedGuests={theme.recommendedGuests}
          recommendedVenue={theme.recommendedVenue}
        />

        {/* One-Click Theme Packages */}
        {theme.packages && theme.packages.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">One-Click Theme Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {theme.packages.map((pkg) => (
                <ThemePackageCard
                  key={pkg.id}
                  package={pkg}
                  themeName={theme.nameEn}
                />
              ))}
            </div>
          </section>
        )}

        {/* Product List (Grouped by Category) */}
        {Object.keys(productsByCategory).length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Product List</h2>
            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Related Theme Recommendations */}
        {relatedThemes.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Theme Recommendations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedThemes.map((relatedTheme) => (
                <Link
                  key={relatedTheme.id}
                  href={`/themes/${relatedTheme.id}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center p-4">
                    <h3 className="text-lg font-semibold text-white text-center">
                      {relatedTheme.nameEn || relatedTheme.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

