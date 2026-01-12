/**
 * 物流费用计算 API 路由
 * 
 * 跨境适配说明：
 * - 根据地址和包裹信息计算物流费用
 * - 支持多种物流方式
 * - 返回物流时效
 * 
 * 新手注意：
 * - 应缓存物流费用计算结果（避免频繁调用 API）
 * - 物流费用可能因实时汇率波动而变化
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  calculateShippingRates,
  type ShippingAddress,
  type PackageInfo,
} from '@/lib/api/shipping';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, packageInfo } = body as {
      address: ShippingAddress;
      packageInfo: PackageInfo;
    };

    // 验证请求参数
    if (!address || !packageInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 计算物流费用
    const rates = await calculateShippingRates(address, packageInfo);

    return NextResponse.json({ rates });
  } catch (error) {
    console.error('Error calculating shipping rates:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
}

