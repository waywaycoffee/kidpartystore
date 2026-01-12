/**
 * 根布局组件
 * 
 * 跨境适配说明：
 * - 初始化 i18n 多语言
 * - 配置 Redux Provider
 * - 全局样式（Tailwind CSS）
 * - SEO 元数据配置
 * 
 * 新手注意：
 * - layout.tsx 是所有页面的父组件
 * - 这里配置全局 providers（如 Redux, i18n）
 * - metadata 用于 SEO 优化
 */

import AIChatbot from '@/components/AIChatbot';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import StructuredData from '@/components/StructuredData';
import {
    generateOrganizationStructuredData,
    generateWebsiteStructuredData,
} from '@/lib/seo';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://partyexpert.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PartyExpert - Kids Birthday Party Supplies | Theme Packages & Decorations',
    template: '%s | PartyExpert',
  },
  description:
    'Shop premium kids birthday party supplies including theme packages, balloons, decorations, and tableware. Fast international shipping to US, CA, GB, AU, EU.',
  keywords: [
    'kids party supplies',
    'birthday decorations',
    'party themes',
    'balloons',
    'tableware',
    'international shipping',
    'party decorations',
    'birthday party supplies',
  ],
  authors: [{ name: 'PartyExpert' }],
  creator: 'PartyExpert',
  publisher: 'PartyExpert',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'PartyExpert',
    title: 'PartyExpert - Kids Birthday Party Supplies',
    description: 'Premium party supplies for unforgettable celebrations',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'PartyExpert - Kids Birthday Party Supplies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PartyExpert - Kids Birthday Party Supplies',
    description: 'Premium party supplies for unforgettable celebrations',
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': [{ url: `${SITE_URL}/feed.xml`, title: 'PartyExpert Blog RSS Feed' }],
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationData = generateOrganizationStructuredData();
  const websiteData = generateWebsiteStructuredData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData data={organizationData} />
        <StructuredData data={websiteData} />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <AIChatbot />
          </div>
        </Providers>
      </body>
    </html>
  );
}

