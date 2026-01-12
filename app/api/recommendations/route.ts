/**
 * Product Recommendations API
 * 产品推荐系统
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface Order {
  id: string;
  items: Array<{ productId: string; quantity: number }>;
  status: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  category?: string;
  theme?: string;
  price: number;
  image?: string;
}

// 基于用户行为的推荐（购买历史）
async function getBehaviorBasedRecommendations(userEmail?: string, limit: number = 10) {
  try {
    const [ordersData, productsData] = await Promise.all([
      fs.readFile(ORDERS_FILE, 'utf-8'),
      fs.readFile(PRODUCTS_FILE, 'utf-8'),
    ]);

    const orders: Order[] = JSON.parse(ordersData);
    const products: Product[] = JSON.parse(productsData);

    // 获取用户购买过的产品
    const userOrders = userEmail
      ? orders.filter((o: any) => o.email === userEmail && (o.status === 'delivered' || o.status === 'shipped'))
      : [];

    const purchasedProductIds = new Set<string>();
    userOrders.forEach((order) => {
      order.items?.forEach((item: any) => {
        purchasedProductIds.add(item.productId || item.id);
      });
    });

    // 找到经常一起购买的产品（关联推荐）
    const coPurchased: Record<string, number> = {};
    orders.forEach((order) => {
      if (order.items && order.items.length > 1) {
        const productIds = order.items.map((item: any) => item.productId || item.id).filter(Boolean);
        productIds.forEach((id1) => {
          productIds.forEach((id2) => {
            if (id1 !== id2) {
              const key = [id1, id2].sort().join('-');
              coPurchased[key] = (coPurchased[key] || 0) + 1;
            }
          });
        });
      }
    });

    // 基于用户购买的产品，推荐经常一起购买的产品
    const recommendations: Product[] = [];
    const recommendationScores: Record<string, number> = {};

    purchasedProductIds.forEach((purchasedId) => {
      Object.entries(coPurchased).forEach(([key, count]) => {
        const [id1, id2] = key.split('-');
        const otherId = id1 === purchasedId ? id2 : id1 === purchasedId ? id1 : null;

        if (otherId && !purchasedProductIds.has(otherId)) {
          recommendationScores[otherId] = (recommendationScores[otherId] || 0) + count;
        }
      });
    });

    // 按分数排序并获取产品
    const sortedIds = Object.entries(recommendationScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id]) => id);

    sortedIds.forEach((id) => {
      const product = products.find((p) => p.id === id);
      if (product) recommendations.push(product);
    });

    return recommendations;
  } catch {
    return [];
  }
}

// 热门产品推荐（基于销量）
async function getPopularRecommendations(limit: number = 10) {
  try {
    const [ordersData, productsData] = await Promise.all([
      fs.readFile(ORDERS_FILE, 'utf-8'),
      fs.readFile(PRODUCTS_FILE, 'utf-8'),
    ]);

    const orders: Order[] = JSON.parse(ordersData);
    const products: Product[] = JSON.parse(productsData);

    // 计算每个产品的销量
    const salesCount: Record<string, number> = {};
    orders.forEach((order) => {
      if (order.status === 'delivered' || order.status === 'shipped') {
        order.items?.forEach((item: any) => {
          const productId = item.productId || item.id;
          if (productId) {
            salesCount[productId] = (salesCount[productId] || 0) + (item.quantity || 1);
          }
        });
      }
    });

    // 按销量排序
    const sortedProducts = products
      .map((product) => ({
        ...product,
        salesCount: salesCount[product.id] || 0,
      }))
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, limit);

    return sortedProducts;
  } catch {
    return [];
  }
}

// 基于类别的推荐
async function getCategoryRecommendations(category: string, excludeProductId?: string, limit: number = 10) {
  try {
    const productsData = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const products: Product[] = JSON.parse(productsData);

    return products
      .filter((p) => p.category === category && p.id !== excludeProductId)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'popular'; // 'popular', 'behavior', 'category'
    const userEmail = searchParams.get('userEmail');
    const category = searchParams.get('category');
    const productId = searchParams.get('productId');
    const limit = parseInt(searchParams.get('limit') || '10');

    let recommendations: any[] = [];

    switch (type) {
      case 'behavior':
        recommendations = await getBehaviorBasedRecommendations(userEmail || undefined, limit);
        break;
      case 'category':
        if (category) {
          recommendations = await getCategoryRecommendations(category, productId || undefined, limit);
        }
        break;
      case 'popular':
      default:
        recommendations = await getPopularRecommendations(limit);
        break;
    }

    return NextResponse.json({
      recommendations,
      type,
      count: recommendations.length,
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

