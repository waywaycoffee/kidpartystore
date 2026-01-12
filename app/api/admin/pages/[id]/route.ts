/**
 * Single Page Management API
 * GET: Get page by ID
 * PUT: Update page
 * DELETE: Delete page
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { verifyAdminAuth } from '@/lib/api-auth';

const DATA_DIR = path.join(process.cwd(), 'data');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

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
  createdAt: string;
  updatedAt: string;
  order?: number;
}

async function getPages(): Promise<Page[]> {
  try {
    await ensureDataDir();
    await fs.access(PAGES_FILE);
    const data = await fs.readFile(PAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function savePages(pages: Page[]) {
  await ensureDataDir();
  await fs.writeFile(PAGES_FILE, JSON.stringify(pages, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pages = await getPages();
    const page = pages.find((p) => p.id === params.id || p.slug === params.id);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const pages = await getPages();
    const index = pages.findIndex((p) => p.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check if slug is being changed and if it conflicts
    if (body.slug && body.slug !== pages[index].slug) {
      if (pages.some((p) => p.id !== params.id && p.slug === body.slug)) {
        return NextResponse.json(
          { error: 'Page with this slug already exists' },
          { status: 400 }
        );
      }
    }

    pages[index] = {
      ...pages[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await savePages(pages);

    return NextResponse.json({ page: pages[index] });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pages = await getPages();
    const filteredPages = pages.filter((p) => p.id !== params.id);

    if (filteredPages.length === pages.length) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    await savePages(filteredPages);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}

