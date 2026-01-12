/**
 * Blog Post Detail Page
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import StructuredData from '@/components/StructuredData';
import { generateBreadcrumbStructuredData } from '@/lib/seo';

const DATA_DIR = path.join(process.cwd(), 'data');
const BLOG_FILE = path.join(DATA_DIR, 'blog', 'posts.json');

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  categories: string[];
  tags: string[];
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const data = await fs.readFile(BLOG_FILE, 'utf-8');
    const posts = JSON.parse(data);
    return posts.find((p: BlogPost) => p.slug === slug) || null;
  } catch {
    return null;
  }
}

async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = await fs.readFile(BLOG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | PartyExpert Blog',
    };
  }

  const imageUrl = post.featuredImage
    ? post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://partyexpert.com'}${post.featuredImage}`
    : undefined;

  return {
    title: `${post.title} | PartyExpert Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://partyexpert.com'}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const breadcrumbs = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage
      ? post.featuredImage.startsWith('http')
        ? post.featuredImage
        : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://partyexpert.com'}${post.featuredImage}`
      : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PartyExpert',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://partyexpert.com'}/logo.png`,
      },
    },
    articleSection: post.categories.join(', '),
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <StructuredData data={articleStructuredData} />
      <div className="min-h-screen bg-gray-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="mb-8">
            <Link href="/blog" className="text-blue-600 hover:text-blue-800">
              ← Back to Blog
            </Link>
          </nav>

          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((cat) => (
                <span key={cat} className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-600 mb-6">
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span className="mx-2">•</span>
              <span>By {post.author}</span>
            </div>
            {post.featuredImage && (
              <Image
                src={post.featuredImage}
                alt={post.title}
                width={1200}
                height={630}
                className="w-full rounded-lg shadow-lg"
                priority
              />
            )}
          </header>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
}

