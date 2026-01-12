/**
 * Theme Carousel Component
 */

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Theme {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  image: string;
  featured: boolean;
}

export default function ThemeCarousel() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const res = await fetch('/api/themes?featured=true');
      const data = await res.json();
      // Show only first 8 themes
      setThemes(data.themes?.slice(0, 8) || []);
    } catch (error) {
      console.error('Failed to fetch themes:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, themes.length - 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, themes.length - 3)) % Math.max(1, themes.length - 3));
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Themes</h2>
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  if (themes.length === 0) {
    return null;
  }

  // Show 4 themes starting from current index (2 on mobile)
  const visibleThemes = themes.slice(currentIndex, currentIndex + 4);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Theme Recommendations</h2>
        <div className="relative">
          {/* Left Arrow */}
          {themes.length > 4 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Previous themes"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Theme Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8">
            {visibleThemes.map((theme) => (
              <Link
                key={theme.id}
                href={`/themes/${theme.id}`}
                className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-gradient-to-br from-primary-400 to-accent-400"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                  <h3 className="text-lg font-semibold mb-2 text-center">
                    {theme.nameEn || theme.name}
                  </h3>
                  {theme.descriptionEn && (
                    <p className="text-sm text-center opacity-90 line-clamp-2">
                      {theme.descriptionEn}
                    </p>
                  )}
                </div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-semibold">
                    View Details
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          {themes.length > 4 && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Next themes"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

