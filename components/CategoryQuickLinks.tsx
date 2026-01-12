/**
 * Category Quick Links Component
 */

'use client';

import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  icon: string;
}

const categories: Category[] = [
  {
    id: 'balloons',
    name: 'Balloons',
    nameEn: 'Balloons',
    slug: 'balloons',
    icon: '🎈',
  },
  {
    id: 'decorations',
    name: 'Decorations',
    nameEn: 'Decorations',
    slug: 'decorations',
    icon: '🎨',
  },
  {
    id: 'tableware',
    name: 'Tableware',
    nameEn: 'Tableware',
    slug: 'tableware',
    icon: '🍽️',
  },
  {
    id: 'games-gifts',
    name: 'Games & Gifts',
    nameEn: 'Games & Gifts',
    slug: 'games-gifts',
    icon: '🎁',
  },
  {
    id: 'pinatas',
    name: 'Piñatas',
    nameEn: 'Piñatas',
    slug: 'pinatas',
    icon: '🎪',
  },
];

export default function CategoryQuickLinks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group bg-white rounded-lg p-6 hover:shadow-lg transition-shadow text-center border-2 border-transparent hover:border-primary-300"
            >
              <div className="text-5xl mb-4">{category.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {category.nameEn}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

