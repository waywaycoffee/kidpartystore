/**
 * Homepage Component
 * 
 * Cross-border e-commerce adaptation:
 * - Themed navigation (A-Z theme display)
 * - Featured product recommendations (by region)
 * - Cross-border shipping advantages
 * - Multi-language banner content
 * 
 * Notes:
 * - Homepage should include clear CTAs
 * - Product recommendations should consider user location
 * - Images should use Next.js Image component for optimization
 */

'use client';

import AgeGroupSection from '@/components/AgeGroupSection';
import CategoryQuickLinks from '@/components/CategoryQuickLinks';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import ThemeCarousel from '@/components/ThemeCarousel';
import VideoPlayer from '@/components/VideoPlayer';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  theme?: string;
  category: string;
  attributes?: {
    ageRange?: string;
    certification?: string[];
    size?: string;
    material?: string;
  };
  estimatedDelivery?: number;
  freeShipping?: boolean;
}

export default function HomePage() {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      // Fetch featured products from API, prioritize featured products
      const res = await fetch('/api/products?featured=true&limit=6');
      const data = await res.json();
      
      // API already sorts by featured priority
      setFeaturedProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      // Use sample data if API fails
      setFeaturedProducts([
        {
          id: '1',
          name: 'Disney Princess Party Package',
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
          theme: 'disney',
          category: 'themePackages',
          attributes: {
            ageRange: '3-8 years',
            certification: ['ASTM', 'EN 71'],
          },
          estimatedDelivery: 7,
          freeShipping: true,
        },
        {
          id: '2',
          name: 'Unicorn Balloon Arch Kit',
          price: 29.99,
          image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
          theme: 'unicorn',
          category: 'balloons',
          attributes: {
            size: '6ft x 4ft',
            material: 'Latex',
            certification: ['Non-Toxic'],
          },
          estimatedDelivery: 5,
          freeShipping: false,
        },
        {
          id: '3',
          name: 'Dinosaur Tableware Set (16 pcs)',
          price: 19.99,
          image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
          theme: 'dinosaur',
          category: 'tableware',
          attributes: {
            certification: ['BPA-Free'],
          },
          estimatedDelivery: 7,
          freeShipping: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Video Introduction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Welcome to PartyExpert
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch our introduction video to learn more about our products and services
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {/* Video will be loaded from API or environment variable */}
            {process.env.NEXT_PUBLIC_HOMEPAGE_VIDEO_URL && (
              <VideoPlayer
                videoUrl={process.env.NEXT_PUBLIC_HOMEPAGE_VIDEO_URL}
                title="PartyExpert Introduction"
                className="shadow-2xl"
              />
            )}
          </div>
        </div>
      </section>

      {/* Featured Products - Most prominent position */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of the most popular party supplies
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured products available</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/products"
                  className="btn-primary inline-block text-lg px-8 py-3"
                >
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🚚</div>
              <h3 className="font-semibold mb-1">Fast Shipping</h3>
              <p className="text-sm text-gray-600">
                International delivery in 5-10 days
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">✓</div>
              <h3 className="font-semibold mb-1">Certified Safe</h3>
              <p className="text-sm text-gray-600">
                ASTM & EN 71 certified products
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <h3 className="font-semibold mb-1">Customizable</h3>
              <p className="text-sm text-gray-600">
                Personalize with names & photos
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💳</div>
              <h3 className="font-semibold mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600">
                PayPal, Stripe, Apple Pay
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Carousel */}
      <ThemeCarousel />

      {/* Age Group Section */}
      <AgeGroupSection />

      {/* Category Quick Links */}
      <CategoryQuickLinks />

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Help Planning Your Party?
          </h2>
          <p className="text-xl mb-8">
            Our experts are here to help you create the perfect celebration
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

