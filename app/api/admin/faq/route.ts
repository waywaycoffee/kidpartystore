/**
 * FAQ Management API
 * GET: Get all FAQs
 * POST: Create new FAQ
 * PUT: Update FAQ
 * DELETE: Delete FAQ
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { verifyAdminAuth } from '@/lib/api-auth';

const DATA_DIR = path.join(process.cwd(), 'data');
const FAQ_FILE = path.join(DATA_DIR, 'help', 'faq.json');

async function ensureDataDir() {
  try {
    await fs.access(path.join(DATA_DIR, 'help'));
  } catch {
    await fs.mkdir(path.join(DATA_DIR, 'help'), { recursive: true });
  }
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
}

async function getFAQs(): Promise<FAQ[]> {
  try {
    await ensureDataDir();
    await fs.access(FAQ_FILE);
    const data = await fs.readFile(FAQ_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveFAQs(faqs: FAQ[]) {
  await ensureDataDir();
  await fs.writeFile(FAQ_FILE, JSON.stringify(faqs, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let faqs = await getFAQs();

    if (category) {
      faqs = faqs.filter((f) => f.category === category);
    }

    // Sort by order if available
    faqs.sort((a, b) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
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
    const { question, answer, category, order } = body;

    if (!question || !answer || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: question, answer, category' },
        { status: 400 }
      );
    }

    const faqs = await getFAQs();
    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.order || 0)) : 0;

    const newFAQ: FAQ = {
      id: `faq-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      question,
      answer,
      category,
      order: order !== undefined ? order : maxOrder + 1,
    };

    faqs.push(newFAQ);
    await saveFAQs(faqs);

    return NextResponse.json({ faq: newFAQ }, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
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
    const { id, question, answer, category, order } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'FAQ ID required' },
        { status: 400 }
      );
    }

    const faqs = await getFAQs();
    const index = faqs.findIndex((f) => f.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    faqs[index] = {
      ...faqs[index],
      ...(question !== undefined && { question }),
      ...(answer !== undefined && { answer }),
      ...(category !== undefined && { category }),
      ...(order !== undefined && { order }),
    };

    await saveFAQs(faqs);

    return NextResponse.json({ faq: faqs[index] });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
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
        { error: 'FAQ ID required' },
        { status: 400 }
      );
    }

    const faqs = await getFAQs();
    const filteredFAQs = faqs.filter((f) => f.id !== id);

    await saveFAQs(filteredFAQs);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}

