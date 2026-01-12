/**
 * 分析数据 API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface OrderItem {
  name?: string;
  price?: number;
  quantity?: number;
  theme?: string;
}

interface Order {
  createdAt: string;
  total?: number;
  items?: OrderItem[];
  pricing?: {
    total: number;
  };
}

async function getOrders(): Promise<Order[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(path.join(DATA_DIR, 'orders.json'), 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '30';

    const days = parseInt(range);
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const orders = await getOrders();

    // 筛选时间范围内的订单
    const filteredOrders = orders.filter(
      (order) => new Date(order.createdAt) >= startDate
    );

    // Group sales by date
    const salesByDate: Record<string, { sales: number; orders: number }> = {};
    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      if (!salesByDate[date]) {
        salesByDate[date] = { sales: 0, orders: 0 };
      }
      salesByDate[date].sales += order.pricing?.total || order.total || 0;
      salesByDate[date].orders += 1;
    });

    const salesData = Object.entries(salesByDate).map(([date, data]) => ({
      date,
      sales: data.sales,
      orders: data.orders,
    }));

    // 按产品统计销售
    const productSalesMap: Record<string, { sales: number; orders: number }> = {};
    filteredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const productName = item.name || 'Unknown';
        if (!productSalesMap[productName]) {
          productSalesMap[productName] = { sales: 0, orders: 0 };
        }
        productSalesMap[productName].sales += (item.price || 0) * (item.quantity || 0);
        productSalesMap[productName].orders += item.quantity || 0;
      });
    });

    const productSales = Object.entries(productSalesMap)
      .map(([name, data]) => ({
        name,
        sales: data.sales,
        orders: data.orders,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    // Calculate sales by theme
    const themeSalesMap: Record<string, { sales: number; orders: number }> = {};
    filteredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const theme = item.theme || 'Other';
        if (!themeSalesMap[theme]) {
          themeSalesMap[theme] = { sales: 0, orders: 0 };
        }
        themeSalesMap[theme].sales += (item.price || 0) * (item.quantity || 0);
        themeSalesMap[theme].orders += item.quantity || 0;
      });
    });

    const themeSales = Object.entries(themeSalesMap)
      .map(([theme, data]) => ({
        theme,
        sales: data.sales,
        orders: data.orders,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    return NextResponse.json({
      salesData,
      productSales,
      themeSales,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      {
        salesData: [],
        productSales: [],
      },
      { status: 200 }
    );
  }
}

