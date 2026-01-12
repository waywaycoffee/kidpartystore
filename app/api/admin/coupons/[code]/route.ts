/**
 * 单个优惠券操作 API
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const body = await request.json();
    const coupons = await getCoupons();
    const index = coupons.findIndex(
      (c) => c.code.toUpperCase() === params.code.toUpperCase()
    );
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }
    
    coupons[index] = {
      ...coupons[index],
      ...body,
      code: coupons[index].code, // 不允许修改优惠码
    };
    
    await saveCoupons(coupons);
    return NextResponse.json({ coupon: coupons[index] });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const coupons = await getCoupons();
    const filteredCoupons = coupons.filter(
      (c) => c.code.toUpperCase() !== params.code.toUpperCase()
    );
    
    await saveCoupons(filteredCoupons);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}

