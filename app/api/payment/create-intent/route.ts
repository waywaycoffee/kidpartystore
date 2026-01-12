/**
 * 支付 API 路由（Next.js API Route）
 * 
 * 跨境适配说明：
 * - 服务端创建支付意图（防止客户端篡改金额）
 * - 支持多货币支付
 * - 支付安全验证
 * 
 * 新手注意：
 * - API Route 在服务端运行，可以安全使用密钥
 * - 应验证请求参数（金额、货币等）
 * - 生产环境应添加速率限制（Rate Limiting）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent, type PaymentIntentData } from '@/lib/api/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      currency,
      orderId,
      customerEmail,
      shippingAddress,
    } = body as PaymentIntentData;

    // 验证请求参数
    if (!amount || !currency || !orderId || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 验证金额（防止负数或过大金额）
    if (amount <= 0 || amount > 1000000) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // 创建支付意图
    const paymentIntent = await createPaymentIntent({
      amount: Math.round(amount * 100), // 转换为分
      currency,
      orderId,
      customerEmail,
      shippingAddress,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

