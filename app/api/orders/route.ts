/**
 * 订单列表 API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface Order {
  id: string;
  userId?: string;
  email: string;
  status:
    | 'pending_payment'
    | 'paid'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'returned';
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  shippingMethod?: {
    id: string;
    name: string;
    days: number;
    cost: number;
  };
  paymentMethod?: {
    type: string;
    last4?: string;
  };
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
  couponCode?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  theme?: string;
}

async function getOrders(): Promise<Order[]> {
  try {
    await ensureDataDir();
    await fs.access(ORDERS_FILE);
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveOrders(orders: Order[]) {
  await ensureDataDir();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const email = searchParams.get('email'); // 用于游客订单查询

    let orders = await getOrders();

    // 筛选逻辑
    if (status) {
      orders = orders.filter((order) => order.status === status);
    }

    if (email) {
      orders = orders.filter((order) => order.email === email);
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ orders: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      items,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      pricing,
      couponCode,
    } = body;

    // Validate required fields
    if (!email || !items || !shippingAddress || !pricing) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Calculate estimated delivery
    const shippingDays = shippingMethod?.days || 7;
    const estimatedDelivery = new Date(
      Date.now() + shippingDays * 24 * 60 * 60 * 1000
    ).toISOString();

    // Create order
    const order: Order = {
      id: orderId,
      email,
      status: 'pending_payment',
      items: items.map((item: {
        id?: string;
        productId?: string;
        name: string;
        price: number;
        quantity: number;
        image?: string;
        theme?: string;
      }) => ({
        productId: item.id || item.productId || '',
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '/placeholder.jpg',
        theme: item.theme,
      })),
      shippingAddress,
      shippingMethod,
      paymentMethod: paymentMethod
        ? {
            type: paymentMethod.type,
            last4: paymentMethod.last4,
          }
        : undefined,
      pricing: {
        subtotal: pricing.subtotal || 0,
        discount: pricing.discount || 0,
        shipping: pricing.shipping || 0,
        tax: pricing.tax || 0,
        total: pricing.total || 0,
      },
      couponCode,
      estimatedDelivery,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save order
    const orders = await getOrders();
    orders.push(order);
    await saveOrders(orders);

    // Send order confirmation email
    try {
      const { sendEmail, generateOrderConfirmationEmail } = await import('@/lib/email');
      const emailData = generateOrderConfirmationEmail({
        orderId: order.id,
        email: order.email,
        items: order.items,
        shippingAddress: order.shippingAddress,
        pricing: order.pricing,
        estimatedDelivery: order.estimatedDelivery,
      });
      await sendEmail({
        to: order.email,
        subject: emailData.subject,
        html: emailData.html,
      });
    } catch (emailError) {
      // Log error but don't fail the order creation
      console.error('Failed to send order confirmation email:', emailError);
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

