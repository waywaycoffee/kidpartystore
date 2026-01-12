/**
 * 支付 API 集成示例
 * 
 * 跨境适配说明：
 * - Stripe 支付集成（支持信用卡、Apple Pay、Google Pay）
 * - PayPal 支付集成
 * - 多货币支付支持
 * - 支付安全（PCI DSS 合规）
 * 
 * 新手注意：
 * - 支付密钥应存储在环境变量中（.env.local）
 * - 生产环境必须使用 HTTPS
 * - 支付信息不应存储在客户端
 * - 使用 Stripe Elements 处理敏感支付信息
 * - 支付成功后应验证 webhook 签名
 */

import Stripe from 'stripe';

// 初始化 Stripe（使用环境变量）
// 注意：Secret key 应该使用 STRIPE_SECRET_KEY（不带 NEXT_PUBLIC_）
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  })
  : null;

export interface PaymentIntentData {
  amount: number; // 金额（USD，单位：分）
  currency: string; // 货币代码（USD, CAD, GBP, EUR, AUD）
  orderId: string; // 订单 ID
  customerEmail: string; // 客户邮箱
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
}

/**
 * 创建支付意图（Payment Intent）
 * 
 * 新手注意：
 * - 金额单位是分（cents），不是元
 * - 货币代码必须使用 ISO 4217 标准
 * - 支付意图应在服务端创建，避免客户端篡改金额
 */
export async function createPaymentIntent(
  data: PaymentIntentData
): Promise<Stripe.PaymentIntent> {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in .env.local');
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount, // 金额（分）
      currency: data.currency.toLowerCase(), // Stripe 需要小写货币代码
      metadata: {
        orderId: data.orderId,
        customerEmail: data.customerEmail,
      },
      shipping: {
        name: data.shippingAddress.name,
        address: {
          line1: data.shippingAddress.line1,
          line2: data.shippingAddress.line2,
          city: data.shippingAddress.city,
          state: data.shippingAddress.state,
          postal_code: data.shippingAddress.postal_code,
          country: data.shippingAddress.country,
        },
      },
      // 自动确认支付（适用于某些支付方式）
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * 确认支付
 */
export async function confirmPayment(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<Stripe.PaymentIntent> {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in .env.local');
  }
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
}

/**
 * PayPal 支付创建订单（简化示例）
 * 
 * 新手注意：
 * - PayPal API 需要使用 PayPal SDK
 * - 需要配置 PayPal Client ID 和 Secret
 * - 生产环境应使用 PayPal Live API
 */
export async function createPayPalOrder(data: {
  amount: number;
  currency: string;
  orderId: string;
}): Promise<{ orderId: string; approvalUrl: string }> {
  // 示例代码（实际应使用 PayPal SDK）
  // const paypal = require('@paypal/checkout-server-sdk');

  // 这里只是示例，实际实现需要使用 PayPal SDK
  return {
    orderId: `PAYPAL-${Date.now()}`,
    approvalUrl: `https://www.paypal.com/checkoutnow?token=${data.orderId}`,
  };
}

/**
 * 验证支付 Webhook（防止伪造）
 * 
 * 新手注意：
 * - Webhook 签名验证非常重要，防止恶意请求
 * - 应验证 webhook 事件类型和订单状态
 * - 使用幂等性处理，避免重复处理同一订单
 */
export async function verifyStripeWebhook(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in .env.local');
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}

/**
 * 处理支付成功 Webhook
 */
export async function handlePaymentSuccess(event: Stripe.Event) {
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    // 更新订单状态为已支付
    // await updateOrderStatus(orderId, 'paid');

    // 发送确认邮件
    // await sendOrderConfirmationEmail(paymentIntent.metadata.customerEmail, orderId);

    console.log(`Payment succeeded for order ${orderId}`);
  }
}

