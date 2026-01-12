/**
 * Shipping Tracking API
 * Shippo equivalent functionality
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { trackShipment } from '@/lib/api/shipping';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

async function getOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveOrders(orders: any[]) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

/**
 * Update order tracking information
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, trackingNumber, carrier } = body;

    if (!orderId || !trackingNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId and trackingNumber' },
        { status: 400 }
      );
    }

    const orders = await getOrders();
    const orderIndex = orders.findIndex((o: any) => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order with tracking number
    orders[orderIndex].trackingNumber = trackingNumber;
    orders[orderIndex].carrier = carrier || 'DHL';
    orders[orderIndex].status = 'shipped';
    orders[orderIndex].shippedAt = new Date().toISOString();
    orders[orderIndex].updatedAt = new Date().toISOString();

    await saveOrders(orders);

    // Fetch tracking information
    const trackingInfo = await trackShipment(trackingNumber, carrier || 'DHL');

    return NextResponse.json({
      success: true,
      order: orders[orderIndex],
      tracking: trackingInfo,
    });
  } catch (error) {
    console.error('Error updating tracking:', error);
    return NextResponse.json(
      { error: 'Failed to update tracking' },
      { status: 500 }
    );
  }
}

/**
 * Get tracking information for an order
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');
    const trackingNumber = searchParams.get('trackingNumber');
    const email = searchParams.get('email');

    if (!orderId && !trackingNumber && !email) {
      return NextResponse.json(
        { error: 'Missing orderId, trackingNumber, or email parameter' },
        { status: 400 }
      );
    }

    const orders = await getOrders();
    let order;

    if (orderId) {
      order = orders.find((o: any) => o.id === orderId);
    } else if (trackingNumber) {
      order = orders.find((o: any) => o.trackingNumber === trackingNumber);
    } else if (email) {
      // Find most recent order for this email
      const userOrders = orders
        .filter((o: any) => o.email === email)
        .sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      order = userOrders[0];
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (!order.trackingNumber) {
      return NextResponse.json(
        { error: 'No tracking number for this order' },
        { status: 400 }
      );
    }

    // Fetch tracking information
    const trackingInfo = await trackShipment(
      order.trackingNumber,
      order.carrier || 'DHL'
    );

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
      },
      tracking: trackingInfo,
    });
  } catch (error) {
    console.error('Error fetching tracking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    );
  }
}

