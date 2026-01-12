/**
 * AI Personalized Email Generation API
 */

import { generatePersonalizedEmail } from '@/lib/ai/personalization';
import { verifyAdminAuth } from '@/lib/api-auth';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

async function getUserProfile(email: string) {
  try {
    // Get orders
    const ordersData = await fs.readFile(ORDERS_FILE, 'utf-8');
    const orders = JSON.parse(ordersData) as Array<{
      email: string;
      items?: Array<{
        id: string;
        name: string;
        category?: string;
        theme?: string;
        price: number;
        quantity: number;
      }>;
      createdAt: string;
    }>;
    const userOrders = orders.filter((o) => o.email === email);

    const purchaseHistory = userOrders.flatMap((order) =>
      (order.items || []).map((item) => ({
        productId: item.id,
        productName: item.name,
        category: item.category || 'themePackages',
        theme: item.theme,
        price: item.price * item.quantity,
        purchasedAt: order.createdAt,
      }))
    );

    // Extract preferences from purchase history
    const themes = [...new Set(purchaseHistory.map((p) => p.theme).filter((t): t is string => Boolean(t)))];
    const prices = purchaseHistory.map((p) => p.price);
    const priceRange = prices.length > 0
      ? { min: Math.min(...prices), max: Math.max(...prices) }
      : undefined;

    return {
      email,
      purchaseHistory,
      browsingHistory: [], // In production, track actual views
      preferences: {
        favoriteThemes: themes,
        priceRange,
      },
    };
  } catch {
    return {
      email,
      purchaseHistory: [],
      browsingHistory: [],
      preferences: {},
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, campaignType } = body;

    if (!email || !campaignType) {
      return NextResponse.json(
        { error: 'Email and campaign type are required' },
        { status: 400 }
      );
    }

    const userProfile = await getUserProfile(email);
    const personalizedContent = await generatePersonalizedEmail(userProfile, campaignType);

    return NextResponse.json({ content: personalizedContent });
  } catch (error) {
    console.error('Error generating personalized email:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized email' },
      { status: 500 }
    );
  }
}

