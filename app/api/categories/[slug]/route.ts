/**
 * 品类商品 API
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

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const products = await getProducts();
    
    // 根据slug筛选产品
    const categoryMap: Record<string, string> = {
      balloons: 'balloons',
      decorations: 'decorations',
      tableware: 'tableware',
      'games-gifts': 'games-gifts',
      pinatas: 'pinatas',
    };

    const category = categoryMap[params.slug];
    const filteredProducts = category
      ? products.filter((p: any) => p.category === category)
      : [];

    return NextResponse.json({
      category: params.slug,
      products: filteredProducts,
    });
  } catch (error) {
    console.error('Error fetching category products:', error);
    return NextResponse.json(
      { category: params.slug, products: [] },
      { status: 200 }
    );
  }
}

