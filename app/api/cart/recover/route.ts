/**
 * Cart Recovery API
 * GET: Recover abandoned cart by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CARTS_FILE = path.join(DATA_DIR, 'carts.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface CartData {
  id: string;
  email?: string;
  userId?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    theme?: string;
    category?: string;
    customization?: any;
    attributes?: any;
  }>;
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  abandoned: boolean;
  reminderSent: boolean;
}

async function getCarts(): Promise<CartData[]> {
  try {
    await ensureDataDir();
    await fs.access(CARTS_FILE);
    const data = await fs.readFile(CARTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveCarts(carts: CartData[]) {
  await ensureDataDir();
  await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cartId = searchParams.get('cartId');

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID required' },
        { status: 400 }
      );
    }

    const carts = await getCarts();
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Mark as recovered
    cart.abandoned = false;
    cart.updatedAt = new Date().toISOString();
    cart.lastActivityAt = new Date().toISOString();

    const cartIndex = carts.findIndex((c) => c.id === cartId);
    carts[cartIndex] = cart;
    await saveCarts(carts);

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error recovering cart:', error);
    return NextResponse.json(
      { error: 'Failed to recover cart' },
      { status: 500 }
    );
  }
}

