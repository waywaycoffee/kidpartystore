/**
 * 优惠券管理 API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const COUPONS_FILE = path.join(DATA_DIR, 'coupons.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  usedCount: number;
  applicableCategories?: string[];
}

async function getCoupons(): Promise<Coupon[]> {
  try {
    await ensureDataDir();
    await fs.access(COUPONS_FILE);
    const data = await fs.readFile(COUPONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveCoupons(coupons: Coupon[]) {
  await ensureDataDir();
  await fs.writeFile(COUPONS_FILE, JSON.stringify(coupons, null, 2));
}

export async function GET() {
  try {
    const coupons = await getCoupons();
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const coupons = await getCoupons();
    
    // 检查优惠码是否已存在
    if (coupons.some((c) => c.code.toUpperCase() === body.code.toUpperCase())) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      );
    }
    
    const newCoupon: Coupon = {
      code: body.code.toUpperCase(),
      type: body.type,
      value: body.value,
      minAmount: body.minAmount,
      maxDiscount: body.maxDiscount,
      validFrom: body.validFrom,
      validTo: body.validTo,
      usageLimit: body.usageLimit,
      usedCount: 0,
      applicableCategories: body.applicableCategories || [],
    };
    
    coupons.push(newCoupon);
    await saveCoupons(coupons);
    
    return NextResponse.json({ coupon: newCoupon });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

