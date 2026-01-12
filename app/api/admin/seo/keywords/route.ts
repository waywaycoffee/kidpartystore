/**
 * SEO Keywords Management API
 * GET: Get all keywords
 * POST: Create new keyword
 * PUT: Update keyword
 * DELETE: Delete keyword
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { verifyAdminAuth } from '@/lib/api-auth';

const DATA_DIR = path.join(process.cwd(), 'data');
const SEO_KEYWORDS_FILE = path.join(DATA_DIR, 'seo-keywords.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface SEOKeyword {
  id: string;
  keyword: string;
  category: 'demand' | 'product' | 'long-tail';
  searchVolume?: number;
  competition?: 'low' | 'medium' | 'high';
  priority: 'high' | 'medium' | 'low';
  targetPages: string[]; // Page URLs or product IDs
  createdAt: string;
  updatedAt: string;
}

async function getKeywords(): Promise<SEOKeyword[]> {
  try {
    await ensureDataDir();
    await fs.access(SEO_KEYWORDS_FILE);
    const data = await fs.readFile(SEO_KEYWORDS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveKeywords(keywords: SEOKeyword[]) {
  await ensureDataDir();
  await fs.writeFile(SEO_KEYWORDS_FILE, JSON.stringify(keywords, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');

    let keywords = await getKeywords();

    if (category) {
      keywords = keywords.filter((k) => k.category === category);
    }

    if (priority) {
      keywords = keywords.filter((k) => k.priority === priority);
    }

    // Sort by priority and search volume
    keywords.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return (b.searchVolume || 0) - (a.searchVolume || 0);
    });

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { keyword, category, searchVolume, competition, priority, targetPages } = body;

    if (!keyword || !category || !priority) {
      return NextResponse.json(
        { error: 'Missing required fields: keyword, category, priority' },
        { status: 400 }
      );
    }

    const keywords = await getKeywords();

    // Check if keyword already exists
    if (keywords.some((k) => k.keyword.toLowerCase() === keyword.toLowerCase())) {
      return NextResponse.json(
        { error: 'Keyword already exists' },
        { status: 400 }
      );
    }

    const newKeyword: SEOKeyword = {
      id: `keyword-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      keyword,
      category,
      searchVolume,
      competition,
      priority,
      targetPages: targetPages || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    keywords.push(newKeyword);
    await saveKeywords(keywords);

    return NextResponse.json({ keyword: newKeyword }, { status: 201 });
  } catch (error) {
    console.error('Error creating keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, keyword, category, searchVolume, competition, priority, targetPages } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Keyword ID required' },
        { status: 400 }
      );
    }

    const keywords = await getKeywords();
    const index = keywords.findIndex((k) => k.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Keyword not found' },
        { status: 404 }
      );
    }

    keywords[index] = {
      ...keywords[index],
      ...(keyword !== undefined && { keyword }),
      ...(category !== undefined && { category }),
      ...(searchVolume !== undefined && { searchVolume }),
      ...(competition !== undefined && { competition }),
      ...(priority !== undefined && { priority }),
      ...(targetPages !== undefined && { targetPages }),
      updatedAt: new Date().toISOString(),
    };

    await saveKeywords(keywords);

    return NextResponse.json({ keyword: keywords[index] });
  } catch (error) {
    console.error('Error updating keyword:', error);
    return NextResponse.json(
      { error: 'Failed to update keyword' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Keyword ID required' },
        { status: 400 }
      );
    }

    const keywords = await getKeywords();
    const filteredKeywords = keywords.filter((k) => k.id !== id);

    await saveKeywords(filteredKeywords);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    return NextResponse.json(
      { error: 'Failed to delete keyword' },
      { status: 500 }
    );
  }
}

