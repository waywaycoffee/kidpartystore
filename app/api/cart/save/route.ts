/**
 * Save Cart API
 * POST: Save user's cart to server
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userId, items, total, itemCount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    const carts = await getCarts();
    const now = new Date().toISOString();

    // Find existing cart for this user/email
    let cartIndex = -1;
    if (email) {
      cartIndex = carts.findIndex((c) => c.email === email && !c.abandoned);
    } else if (userId) {
      cartIndex = carts.findIndex((c) => c.userId === userId && !c.abandoned);
    }

    if (cartIndex !== -1) {
      // Update existing cart
      carts[cartIndex] = {
        ...carts[cartIndex],
        items,
        total,
        itemCount,
        updatedAt: now,
        lastActivityAt: now,
        abandoned: false,
      };
    } else {
      // Create new cart
      const newCart: CartData = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        email,
        userId,
        items,
        total,
        itemCount,
        createdAt: now,
        updatedAt: now,
        lastActivityAt: now,
        abandoned: false,
        reminderSent: false,
      };
      carts.push(newCart);
    }

    await saveCarts(carts);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving cart:', error);
    return NextResponse.json(
      { error: 'Failed to save cart' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Email or userId required' },
        { status: 400 }
      );
    }

    const carts = await getCarts();
    let cart;

    if (email) {
      cart = carts.find((c) => c.email === email && !c.abandoned);
    } else {
      cart = carts.find((c) => c.userId === userId && !c.abandoned);
    }

    if (!cart) {
      return NextResponse.json({ cart: null });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

