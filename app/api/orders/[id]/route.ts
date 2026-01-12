/**
 * 订单详情 API
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
  status: string;
  email?: string;
  [key: string]: unknown;
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orders = await getOrders();
    const order = orders.find((o) => o.id === params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const action = body.action; // 'cancel', 'return', or 'update'
    const status = body.status; // For status updates

    const orders = await getOrders();
    const orderIndex = orders.findIndex((o) => o.id === params.id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orders[orderIndex];

    if (action === 'update' && status) {
      // Direct status update (for admin)
      const oldStatus = order.status;
      order.status = status;
      order.updatedAt = new Date().toISOString();
      
      // Update tracking number if provided
      if (body.trackingNumber) {
        order.trackingNumber = body.trackingNumber;
      }

      // Send shipping notification email when status changes to 'shipped'
      if (status === 'shipped' && oldStatus !== 'shipped' && order.email) {
        try {
          const { sendEmail, generateShippingNotificationEmail } = await import('@/lib/email');
          const emailData = generateShippingNotificationEmail({
            orderId: order.id,
            email: order.email,
            items: (order.items as Array<{ name: string; quantity: number; price: number; image?: string }>) || [],
            shippingAddress: order.shippingAddress as any,
            pricing: order.pricing as any,
            trackingNumber: order.trackingNumber as string | undefined,
            estimatedDelivery: order.estimatedDelivery as string | undefined,
          });
          await sendEmail({
            to: order.email,
            subject: emailData.subject,
            html: emailData.html,
          });
        } catch (emailError) {
          console.error('Failed to send shipping notification email:', emailError);
        }
      }
    } else if (action === 'cancel') {
      if (order.status !== 'pending_payment' && order.status !== 'paid') {
        return NextResponse.json(
          { error: 'Order cannot be cancelled' },
          { status: 400 }
        );
      }
      order.status = 'cancelled';
      order.updatedAt = new Date().toISOString();
    } else if (action === 'return') {
      if (order.status !== 'delivered') {
        return NextResponse.json(
          { error: 'Order cannot be returned' },
          { status: 400 }
        );
      }
      order.status = 'returned';
      order.updatedAt = new Date().toISOString();
    }

    orders[orderIndex] = order;
    await saveOrders(orders);

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

