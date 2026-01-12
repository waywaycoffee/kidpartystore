/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml for SEO
 */

import { MetadataRoute } from 'next';
import fs from 'fs/promises';
import path from 'path';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://partyexpert.com';

async function getProducts() {
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'data', 'products.json'), 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function getThemes() {
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'data', 'themes.json'), 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const themes = await getThemes();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/kids-birthday`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/themes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Category pages
  const categories = ['balloons', 'decorations', 'tableware', 'games-gifts', 'pinatas'];
  const categoryPages: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${SITE_URL}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Product pages
  const productPages: MetadataRoute.Sitemap = products.map((product: { id: string; updatedAt?: string }) => ({
    url: `${SITE_URL}/products/${product.id}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Theme pages
  const themePages: MetadataRoute.Sitemap = themes.map((theme: { id: string; updatedAt?: string }) => ({
    url: `${SITE_URL}/themes/${theme.id}`,
    lastModified: theme.updatedAt ? new Date(theme.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...themePages];
}

