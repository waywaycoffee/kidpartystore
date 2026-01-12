/**
 * 收货信息 API
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shippingAddress, saveAddress } = body;

    // 验证地址
    if (
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      return NextResponse.json(
        { error: 'Missing required address fields' },
        { status: 400 }
      );
    }

    // 生成地址ID（如果保存）
    const addressId = saveAddress ? `addr-${Date.now()}` : undefined;

    // 计算运费预估（简化版）
    const shippingOptions = [
      {
        id: 'standard',
        name: 'Standard Shipping',
        days: 7,
        cost: 9.99,
        freeThreshold: 50,
      },
      {
        id: 'express',
        name: 'Express Shipping',
        days: 3,
        cost: 19.99,
        freeThreshold: 100,
      },
      {
        id: 'overnight',
        name: 'Overnight Shipping',
        days: 1,
        cost: 39.99,
        freeThreshold: 200,
      },
    ];

    return NextResponse.json({
      addressId,
      shippingOptions,
      validated: true,
    });
  } catch (error) {
    console.error('Error processing shipping address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

