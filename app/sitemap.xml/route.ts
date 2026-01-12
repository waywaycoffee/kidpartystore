/**
 * Dynamic XML Sitemap Generator
 * Generates sitemap for all products, pages, and blog posts
 */

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');
const BLOG_POSTS_FILE = path.join(DATA_DIR, 'blog', 'posts.json');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getProducts() {
  try {
    await fs.access(PRODUCTS_FILE);
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function getPages() {
  try {
    await fs.access(PAGES_FILE);
    const data = await fs.readFile(PAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function getBlogPosts() {
  try {
    await fs.access(BLOG_POSTS_FILE);
    const data = await fs.readFile(BLOG_POSTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function generateSitemapEntry(url: string, lastmod?: string, changefreq: string = 'weekly', priority: string = '0.8') {
  return `  <url>
    <loc>${url}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  try {
    const products = await getProducts();
    const pages = await getPages();
    const blogPosts = await getBlogPosts();

    const sitemapEntries: string[] = [];

    // Homepage
    sitemapEntries.push(generateSitemapEntry(SITE_URL, new Date().toISOString().split('T')[0], 'daily', '1.0'));

    // Static pages
    const staticPages = [
      { path: '/products', priority: '0.9' },
      { path: '/themes', priority: '0.9' },
      { path: '/kids-birthday', priority: '0.9' },
      { path: '/help', priority: '0.7' },
      { path: '/blog', priority: '0.8' },
    ];

    staticPages.forEach((page) => {
      sitemapEntries.push(
        generateSitemapEntry(`${SITE_URL}${page.path}`, new Date().toISOString().split('T')[0], 'weekly', page.priority)
      );
    });

    // Product pages
    products
      .filter((p: any) => p.status === 'active')
      .forEach((product: any) => {
        const lastmod = product.updatedAt
          ? new Date(product.updatedAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        sitemapEntries.push(
          generateSitemapEntry(`${SITE_URL}/products/${product.id}`, lastmod, 'weekly', '0.8')
        );
      });

    // Dynamic pages
    pages
      .filter((p: any) => p.status === 'published')
      .forEach((page: any) => {
        const lastmod = page.updatedAt
          ? new Date(page.updatedAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        sitemapEntries.push(
          generateSitemapEntry(`${SITE_URL}/${page.slug}`, lastmod, 'monthly', '0.7')
        );
      });

    // Blog posts
    blogPosts.forEach((post: any) => {
      const lastmod = post.updatedAt
        ? new Date(post.updatedAt).toISOString().split('T')[0]
        : new Date(post.publishedAt).toISOString().split('T')[0];
      sitemapEntries.push(
        generateSitemapEntry(`${SITE_URL}/blog/${post.slug}`, lastmod, 'monthly', '0.7')
      );
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

