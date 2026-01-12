/**
 * AI Inventory Prediction API
 * Predicts demand and identifies slow-moving products
 */

import { verifyAdminAuth } from '@/lib/api-auth';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

interface OrderItem {
  productId: string;
  id?: string; // Support legacy data that might use 'id'
  name: string;
  price: number;
  quantity: number;
  image?: string;
  theme?: string;
}

interface Order {
  id: string;
  status: string;
  items?: OrderItem[];
  createdAt: string;
}

interface SalesData {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
  lastSoldDate?: string;
  daysSinceLastSale?: number;
  averageMonthlySales: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

async function analyzeSalesData(): Promise<SalesData[]> {
  try {
    const [ordersData, productsData] = await Promise.all([
      fs.readFile(ORDERS_FILE, 'utf-8'),
      fs.readFile(PRODUCTS_FILE, 'utf-8'),
    ]);

    const orders: Order[] = JSON.parse(ordersData);
    const products = JSON.parse(productsData);

    // Calculate sales for each product
    const salesMap: Record<string, {
      totalSold: number;
      totalRevenue: number;
      salesDates: string[];
    }> = {};

    orders.forEach((order: Order) => {
      if (order.status === 'completed' || order.status === 'shipped' || order.status === 'delivered') {
        order.items?.forEach((item: OrderItem) => {
          const productId = item.productId || item.id;
          if (!productId) return;
          
          if (!salesMap[productId]) {
            salesMap[productId] = {
              totalSold: 0,
              totalRevenue: 0,
              salesDates: [],
            };
          }
          salesMap[productId].totalSold += item.quantity;
          salesMap[productId].totalRevenue += item.price * item.quantity;
          salesMap[productId].salesDates.push(order.createdAt);
        });
      }
    });

    // Analyze each product
    const salesData: SalesData[] = (products as Array<{ id: string; name: string }>).map((product) => {
      const sales = salesMap[product.id] || {
        totalSold: 0,
        totalRevenue: 0,
        salesDates: [],
      };

      const now = Date.now();
      const oldestOrder = orders[0]?.createdAt;
      const daysSinceStart = oldestOrder
        ? (now - new Date(oldestOrder).getTime()) / (1000 * 60 * 60 * 24)
        : 30;
      const monthsSinceStart = Math.max(daysSinceStart / 30, 1);
      const averageMonthlySales = sales.totalSold / monthsSinceStart;

      const lastSoldDate = sales.salesDates.length > 0
        ? sales.salesDates.sort().reverse()[0]
        : undefined;
      const daysSinceLastSale = lastSoldDate
        ? (now - new Date(lastSoldDate).getTime()) / (1000 * 60 * 60 * 24)
        : undefined;

      // Determine trend (simplified - compare last 30 days to previous 30 days)
      const recentSales = sales.salesDates.filter(
        (date: string) => (now - new Date(date).getTime()) / (1000 * 60 * 60 * 24) <= 30
      ).length;
      const olderSales = sales.salesDates.filter(
        (date: string) => {
          const days = (now - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
          return days > 30 && days <= 60;
        }
      ).length;

      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (recentSales > olderSales * 1.2) trend = 'increasing';
      else if (recentSales < olderSales * 0.8) trend = 'decreasing';

      return {
        productId: product.id,
        productName: product.name,
        totalSold: sales.totalSold,
        totalRevenue: sales.totalRevenue,
        lastSoldDate,
        daysSinceLastSale,
        averageMonthlySales,
        trend,
      };
    });

    return salesData;
  } catch (error) {
    console.error('Error analyzing sales data:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const salesData = await analyzeSalesData();

    // Identify slow-moving products (no sales in 60+ days)
    const slowMoving = salesData.filter(
      (s) => s.daysSinceLastSale !== undefined && s.daysSinceLastSale > 60
    );

    // Identify high-demand products (increasing trend, high sales)
    const highDemand = salesData
      .filter((s) => s.trend === 'increasing' && s.averageMonthlySales > 5)
      .sort((a, b) => b.averageMonthlySales - a.averageMonthlySales)
      .slice(0, 10);

    // Predict next month demand (simplified - based on trend)
    const predictions = salesData.map((s) => ({
      productId: s.productId,
      productName: s.productName,
      currentMonthlyAverage: s.averageMonthlySales,
      predictedNextMonth: s.trend === 'increasing'
        ? s.averageMonthlySales * 1.3
        : s.trend === 'decreasing'
        ? s.averageMonthlySales * 0.7
        : s.averageMonthlySales,
      recommendation: s.trend === 'increasing' && s.averageMonthlySales > 5
        ? 'increase-stock'
        : s.daysSinceLastSale && s.daysSinceLastSale > 60
        ? 'clearance'
        : 'maintain',
    }));

    return NextResponse.json({
      salesData,
      slowMoving,
      highDemand,
      predictions,
    });
  } catch (error) {
    console.error('Error predicting inventory:', error);
    return NextResponse.json(
      { error: 'Failed to predict inventory' },
      { status: 500 }
    );
  }
}

