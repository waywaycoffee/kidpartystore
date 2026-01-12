/**
 * 产品管理 API
 * 
 * GET: 获取产品列表
 * POST: 创建新产品
 */

import { verifyAdminAuth } from '@/lib/api-auth';
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
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

interface Product {
  id: string;
  name: string;
  price: number;
  [key: string]: unknown;
}

async function saveProducts(products: Product[]) {
  await ensureDataDir();
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ products: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdminAuth(request);
  if (!auth.authorized) {
    return auth.error!;
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: 'Missing required fields: name and price are required' },
        { status: 400 }
      );
    }

    // Validate price
    if (typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      );
    }

    const products = await getProducts();

    const newProduct = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: body.name,
      price: parseFloat(body.price),
      description: body.description || '',
      image: body.image || '/placeholder.jpg',
      category: body.category || 'themePackages',
      theme: body.theme || '',
      featured: body.featured || false,
      stock: parseInt(body.stock) || 0,
      status: body.status || 'draft',
      attributes: body.attributes || {},
      estimatedDelivery: body.estimatedDelivery || 7,
      freeShipping: body.freeShipping || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.push(newProduct);
    await saveProducts(products);

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

