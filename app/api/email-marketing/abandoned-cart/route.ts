/**
 * Abandoned Cart Email API
 * Sends recovery email 1 hour after cart abandonment
 */

import { emailMarketingService } from '@/lib/email-marketing';
import type { CartItem } from '@/store/slices/cartSlice';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ABANDONED_CARTS_FILE = path.join(DATA_DIR, 'abandoned-carts.json');

interface AbandonedCart {
  id: string;
  email: string;
  cartItems: CartItem[];
  cartTotal: number;
  abandonedAt: string;
  emailSent: boolean;
  recovered: boolean;
  discountCode?: string;
}

async function getAbandonedCarts(): Promise<AbandonedCart[]> {
  try {
    await fs.access(ABANDONED_CARTS_FILE);
    const data = await fs.readFile(ABANDONED_CARTS_FILE, 'utf-8');
    return JSON.parse(data) as AbandonedCart[];
  } catch {
    return [];
  }
}

async function saveAbandonedCarts(carts: AbandonedCart[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ABANDONED_CARTS_FILE, JSON.stringify(carts, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, cartItems, cartTotal, cartId } = body;

    if (!email || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save abandoned cart
    const carts = await getAbandonedCarts();
    const abandonedCart = {
      id: cartId || `cart-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      email,
      cartItems,
      cartTotal,
      abandonedAt: new Date().toISOString(),
      emailSent: false,
      recovered: false,
    };

    carts.push(abandonedCart);
    await saveAbandonedCarts(carts);

    // Schedule email to be sent after 1 hour
    // In production, use a job queue (e.g., Bull, Agenda)
    setTimeout(async () => {
      const recoveryUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cart/recover?token=${abandonedCart.id}`;
      
      // Generate discount code (optional)
      const discountCode = `RECOVER${Date.now().toString().slice(-6)}`;
      
      await emailMarketingService.sendAbandonedCartEmail({
        email,
        cartItems,
        cartTotal,
        recoveryUrl,
        discountCode,
        discountAmount: 5, // $5 discount
      });

      // Update cart record
      const updatedCarts = await getAbandonedCarts();
      const cartIndex = updatedCarts.findIndex((c) => c.id === abandonedCart.id);
      if (cartIndex !== -1) {
        updatedCarts[cartIndex].emailSent = true;
        updatedCarts[cartIndex].discountCode = discountCode;
        await saveAbandonedCarts(updatedCarts);
      }
    }, 60 * 60 * 1000); // 1 hour

    return NextResponse.json({ success: true, cartId: abandonedCart.id });
  } catch (error) {
    console.error('Error processing abandoned cart:', error);
    return NextResponse.json(
      { error: 'Failed to process abandoned cart' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    const carts = await getAbandonedCarts();
    
    if (email) {
      const userCarts = carts.filter((c) => c.email === email && !c.recovered);
      return NextResponse.json({ carts: userCarts });
    }

    return NextResponse.json({ carts });
  } catch (error) {
    console.error('Error fetching abandoned carts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch abandoned carts' },
      { status: 500 }
    );
  }
}

