/**
 * Inventory Products API
 */

import fs from 'fs/promises';
import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    await ensureDataDir();
    await fs.access(PRODUCTS_FILE);
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);

    // Add lowStockThreshold if not exists (default: 10)
    const productsWithThreshold = products.map((product: any) => ({
      ...product,
      stock: product.stock || 0,
      lowStockThreshold: product.lowStockThreshold || 10,
    }));

    return NextResponse.json({ products: productsWithThreshold });
  } catch {
    return NextResponse.json({ products: [] });
  }
}

