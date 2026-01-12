/**
 * Order Invoice API
 * GET: Generate and download PDF invoice for an order
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { generateInvoicePDF } from '@/lib/invoice';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function getOrders() {
  try {
    await ensureDataDir();
    await fs.access(ORDERS_FILE);
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orders = await getOrders();
    const order = orders.find((o: any) => o.id === params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Generate PDF invoice
    const pdfBuffer = await generateInvoicePDF({
      orderId: order.id,
      orderDate: order.createdAt,
      email: order.email,
      items: order.items,
      shippingAddress: order.shippingAddress,
      pricing: order.pricing,
      couponCode: order.couponCode,
      trackingNumber: order.trackingNumber,
    });

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}

