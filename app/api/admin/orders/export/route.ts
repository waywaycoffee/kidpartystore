/**
 * Orders Export API
 * GET: Export orders to CSV/Excel
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifyAdminAuth } from '@/lib/api-auth';

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

function convertToCSV(orders: any[]): string {
  if (orders.length === 0) {
    return 'No orders found';
  }

  // CSV Header
  const headers = [
    'Order ID',
    'Email',
    'Status',
    'Items',
    'Subtotal',
    'Discount',
    'Shipping',
    'Tax',
    'Total',
    'Shipping Address',
    'Created At',
    'Updated At',
  ];

  // CSV Rows
  const rows = orders.map((order) => {
    const items = order.items.map((item: any) => `${item.name} (x${item.quantity})`).join('; ');
    const shippingAddress = order.shippingAddress
      ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}, ${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
      : 'N/A';

    return [
      order.id,
      order.email || '',
      order.status || '',
      items,
      order.pricing?.subtotal?.toFixed(2) || '0.00',
      order.pricing?.discount?.toFixed(2) || '0.00',
      order.pricing?.shipping?.toFixed(2) || '0.00',
      order.pricing?.tax?.toFixed(2) || '0.00',
      order.pricing?.total?.toFixed(2) || '0.00',
      shippingAddress,
      order.createdAt || '',
      order.updatedAt || '',
    ].map((field) => {
      // Escape commas and quotes in CSV
      const str = String(field || '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
  });

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  return csvContent;
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'csv'; // csv or excel
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let orders = await getOrders();

    // Apply filters
    if (status) {
      orders = orders.filter((o: any) => o.status === status);
    }

    if (startDate) {
      orders = orders.filter((o: any) => new Date(o.createdAt) >= new Date(startDate));
    }

    if (endDate) {
      orders = orders.filter((o: any) => new Date(o.createdAt) <= new Date(endDate));
    }

    // Sort by creation date (newest first)
    orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (format === 'csv') {
      const csvContent = convertToCSV(orders);
      const timestamp = new Date().toISOString().split('T')[0];

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="orders-${timestamp}.csv"`,
        },
      });
    } else {
      // For Excel format, we'll return CSV with .xlsx extension
      // In production, you might want to use a library like 'xlsx' for proper Excel generation
      const csvContent = convertToCSV(orders);
      const timestamp = new Date().toISOString().split('T')[0];

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="orders-${timestamp}.xlsx"`,
        },
      });
    }
  } catch (error) {
    console.error('Error exporting orders:', error);
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    );
  }
}

