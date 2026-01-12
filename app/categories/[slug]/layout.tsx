/**
 * Category Page Layout with SEO Metadata
 */

import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';

const categoryMap: Record<string, { name: string; description: string }> = {
  balloons: {
    name: 'Balloons',
    description: 'Shop premium party balloons including latex balloons, foil balloons, and balloon arches. Perfect for birthday parties and celebrations.',
  },
  decorations: {
    name: 'Decorations',
    description: 'Find the perfect party decorations including banners, streamers, confetti, and more. Transform any space into a celebration.',
  },
  tableware: {
    name: 'Tableware',
    description: 'Complete party tableware sets including plates, cups, napkins, and utensils. Themed designs for every celebration.',
  },
  'games-gifts': {
    name: 'Games & Gifts',
    description: 'Party games and party favor gifts to keep guests entertained. Perfect for kids birthday parties.',
  },
  pinatas: {
    name: 'Piñatas',
    description: 'Fun and colorful piñatas filled with treats. Available in various themes and sizes for your party.',
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = categoryMap[params.slug];

  if (!category) {
    return {
      title: 'Category Not Found | PartyExpert',
    };
  }

  return generateCategoryMetadata({
    slug: params.slug,
    name: category.name,
    description: category.description,
  });
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

