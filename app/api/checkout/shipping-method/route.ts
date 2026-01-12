/**
 * 配送方式 API
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, cartTotal } = body;

    const shippingMethods: Record<string, any> = {
      standard: {
        id: 'standard',
        name: 'Standard Shipping',
        days: 7,
        cost: cartTotal >= 50 ? 0 : 9.99,
        freeThreshold: 50,
      },
      express: {
        id: 'express',
        name: 'Express Shipping',
        days: 3,
        cost: cartTotal >= 100 ? 0 : 19.99,
        freeThreshold: 100,
      },
      overnight: {
        id: 'overnight',
        name: 'Overnight Shipping',
        days: 1,
        cost: cartTotal >= 200 ? 0 : 39.99,
        freeThreshold: 200,
      },
    };

    const selectedMethod = shippingMethods[method];

    if (!selectedMethod) {
      return NextResponse.json(
        { error: 'Invalid shipping method' },
        { status: 400 }
      );
    }

    const estimatedDelivery = new Date(
      Date.now() + selectedMethod.days * 24 * 60 * 60 * 1000
    ).toISOString();

    return NextResponse.json({
      shippingCost: selectedMethod.cost,
      estimatedDays: selectedMethod.days,
      estimatedDelivery,
      method: selectedMethod,
    });
  } catch (error) {
    console.error('Error processing shipping method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

