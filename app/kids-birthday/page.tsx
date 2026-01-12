/**
 * Kids Birthday Party Page
 */

'use client';

import ProductCard from '@/components/ProductCard';
import ThemeFilter from '@/components/ThemeFilter';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Theme {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  image: string;
  ageRange: { min: number; max: number };
  gender: 'boy' | 'girl' | 'neutral';
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  theme?: string;
  category: string;
}

export default function KidsBirthdayPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedGender, setSelectedGender] = useState<'boy' | 'girl' | 'neutral' | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGender, selectedAgeGroup]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (selectedGender) params.append('gender', selectedGender);
      if (selectedAgeGroup) params.append('ageGroup', selectedAgeGroup);

      // Fetch themes
      const themesRes = await fetch(`/api/themes?${params.toString()}`);
      const themesData = await themesRes.json();
      setThemes(themesData.themes || []);

      // Fetch products
      const productsRes = await fetch('/api/products?category=kids-birthday');
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Kids Birthday Party Supplies</h1>
          <p className="text-xl text-gray-600">
            Complete themes and one-stop shopping for all ages and interests
          </p>
        </div>

        {/* Scene Entry Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <Link
              href="/kids-birthday?gender=boy"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Boy Themes
            </Link>
            <Link
              href="/kids-birthday?gender=girl"
              className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Girl Themes
            </Link>
            <Link
              href="/kids-birthday?gender=neutral"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Neutral Themes
            </Link>
            <Link
              href="/categories/pinatas"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Piñatas
            </Link>
            <Link
              href="/categories/games-gifts"
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Party Games
            </Link>
          </div>
        </div>

        {/* Theme Filter */}
        <ThemeFilter
          selectedGender={selectedGender}
          selectedAgeGroup={selectedAgeGroup}
          onGenderChange={setSelectedGender}
          onAgeGroupChange={setSelectedAgeGroup}
        />

        {/* Theme Display Area */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Theme Recommendations</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : themes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No themes available</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {themes.map((theme) => (
                <Link
                  key={theme.id}
                  href={`/themes/${theme.id}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center p-4">
                    <h3 className="text-lg font-semibold text-white text-center">
                      {theme.nameEn || theme.name}
                    </h3>
                  </div>
                  <div className="p-4">
                    {theme.descriptionEn && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {theme.descriptionEn}
                      </p>
                    )}
                    <div className="mt-2 flex gap-2 text-xs text-gray-500">
                      <span>
                        {theme.ageRange.min}-{theme.ageRange.max} Years
                      </span>
                      <span>•</span>
                      <span>
                        {theme.gender === 'boy'
                          ? 'Boy'
                          : theme.gender === 'girl'
                          ? 'Girl'
                          : 'Neutral'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Popular Products */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Popular Products</h2>
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No products available</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

