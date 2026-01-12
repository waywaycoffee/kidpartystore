/**
 * 管理后台统计数据 API
 */

import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    await ensureDataDir();

    // Read order data
    interface Order {
      createdAt: string;
      pricing?: { total: number };
      total?: number;
    }
    
    let orders: Order[] = [];
    try {
      const ordersData = await fs.readFile(
        path.join(DATA_DIR, 'orders.json'),
        'utf-8'
      );
      orders = JSON.parse(ordersData);
    } catch {
      // File doesn't exist, use empty array
    }

    // 计算统计数据
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(
      (order) => new Date(order.createdAt) >= thirtyDaysAgo
    );

    const totalSales = recentOrders.reduce(
      (sum, order) => sum + (order.pricing?.total || order.total || 0),
      0
    );
    const totalOrders = recentOrders.length;
    const visits = 1; // 示例数据，实际应从分析服务获取
    const conversionRate =
      visits > 0 ? (totalOrders / visits) * 100 : 0;

    // 计算变化率（示例数据）
    const stats = {
      visits: visits,
      visitsChange: 89, // 示例
      totalSales: totalSales,
      salesChange: totalSales > 0 ? 100 : 0,
      orders: totalOrders,
      ordersChange: totalOrders > 0 ? 100 : 0,
      conversionRate: conversionRate,
      conversionChange: conversionRate > 0 ? 50 : 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        visits: 1,
        visitsChange: 89,
        totalSales: 0,
        salesChange: 0,
        orders: 0,
        ordersChange: 0,
        conversionRate: 0,
        conversionChange: 0,
      },
      { status: 200 }
    );
  }
}

