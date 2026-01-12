/**
 * Dynamic Page Route
 * Renders pages from data/pages.json
 */

import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import type { Metadata } from 'next';

const DATA_DIR = path.join(process.cwd(), 'data');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: 'draft' | 'published';
}

async function getPage(slug: string): Promise<Page | null> {
  try {
    await fs.access(PAGES_FILE);
    const data = await fs.readFile(PAGES_FILE, 'utf-8');
    const pages: Page[] = JSON.parse(data);
    const page = pages.find((p) => p.slug === slug && p.status === 'published');
    return page || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPage(params.slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.excerpt,
    keywords: page.metaKeywords,
  };
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
          {page.excerpt && (
            <p className="text-lg text-gray-600">{page.excerpt}</p>
          )}
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  );
}

