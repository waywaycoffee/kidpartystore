/**
 * Hero Banner Component
 */

'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function HeroBanner({
  title,
  subtitle,
  ctaText,
  ctaLink = '/themes',
}: HeroBannerProps) {
  const { t } = useTranslation();

  const defaultTitle = title || 'One-Stop Kids Party Supplies - Perfect Birthday Celebrations';
  const defaultSubtitle =
    subtitle ||
    'Premium party supplies delivered worldwide - Make Every Birthday Unforgettable';
  const defaultCtaText = ctaText || 'Choose Theme';

  return (
    <section className="bg-gradient-to-r from-primary-500 to-accent-500 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{defaultTitle}</h1>
          <p className="text-xl md:text-2xl mb-8">{defaultSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={ctaLink}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {defaultCtaText}
            </Link>
            <Link
              href="/categories"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              {t('common.browseCategories') || 'Browse Categories'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

