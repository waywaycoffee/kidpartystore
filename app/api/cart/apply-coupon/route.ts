/**
 * 优惠码 API
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { couponCode, cartTotal } = body;

    if (!couponCode || !cartTotal) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const coupons = await getCoupons();
    const coupon = coupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase());

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Invalid coupon code' },
        { status: 400 }
      );
    }

    // 检查有效期
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validTo = new Date(coupon.validTo);

    if (now < validFrom || now > validTo) {
      return NextResponse.json(
        { success: false, error: 'Coupon has expired' },
        { status: 400 }
      );
    }

    // 检查最低消费金额
    if (coupon.minAmount && cartTotal < coupon.minAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order amount of $${coupon.minAmount} required`,
        },
        { status: 400 }
      );
    }

    // 检查使用次数限制
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    // 计算折扣
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (cartTotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.value;
    }

    const finalAmount = Math.max(0, cartTotal - discount);

    return NextResponse.json({
      success: true,
      discount,
      type: coupon.type,
      finalAmount,
      couponCode: coupon.code,
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

