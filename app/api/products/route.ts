/**
 * 产品列表 API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function getProducts() {
  try {
    await ensureDataDir();
    await fs.access(PRODUCTS_FILE);
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const theme = searchParams.get('theme');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured') === 'true';

    let products = await getProducts();

    // 筛选逻辑
    if (category) {
      products = products.filter((p: any) => p.category === category);
    }

    if (theme) {
      products = products.filter((p: any) => p.theme === theme);
    }

    if (featured) {
      // Only return featured products when featured=true
      products = products.filter((p: any) => p.featured === true);
    }

    // 限制数量
    if (limit) {
      products = products.slice(0, parseInt(limit));
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ products: [] }, { status: 200 });
  }
}

