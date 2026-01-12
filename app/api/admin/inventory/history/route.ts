/**
 * Inventory History API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const INVENTORY_HISTORY_FILE = path.join(DATA_DIR, 'inventory-history.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const productId = searchParams.get('productId');

    await ensureDataDir();
    await fs.access(INVENTORY_HISTORY_FILE);
    const data = await fs.readFile(INVENTORY_HISTORY_FILE, 'utf-8');
    let history = JSON.parse(data);

    // Filter by productId if provided
    if (productId) {
      history = history.filter((h: any) => h.productId === productId);
    }

    // Sort by date (newest first) and limit
    history = history
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ history: [] });
  }
}

