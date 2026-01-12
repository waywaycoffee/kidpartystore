/**
 * 主题列表 API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const THEMES_FILE = path.join(DATA_DIR, 'themes.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface Theme {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  image: string;
  bannerImage?: string;
  ageRange: {
    min: number;
    max: number;
  };
  gender: 'boy' | 'girl' | 'neutral';
  recommendedGuests?: number;
  recommendedVenue?: string;
  featured: boolean;
  packages?: ThemePackage[];
  createdAt: string;
  updatedAt: string;
}

interface ThemePackage {
  id: string;
  name: string;
  level: 'basic' | 'standard' | 'premium';
  price: number;
  items: PackageItem[];
  savings?: number;
  image?: string;
}

interface PackageItem {
  productId: string;
  quantity: number;
  name: string;
}

async function getThemes(): Promise<Theme[]> {
  try {
    await ensureDataDir();
    await fs.access(THEMES_FILE);
    const data = await fs.readFile(THEMES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, return empty array
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const gender = searchParams.get('gender') as 'boy' | 'girl' | 'neutral' | null;
    const ageGroup = searchParams.get('ageGroup');
    const featured = searchParams.get('featured') === 'true';

    let themes = await getThemes();

    // 筛选逻辑
    if (category) {
      // 可以根据category筛选，这里简化处理
    }

    if (gender) {
      themes = themes.filter((theme) => theme.gender === gender || theme.gender === 'neutral');
    }

    if (ageGroup) {
      // 解析年龄段
      if (ageGroup === '1') {
        themes = themes.filter((theme) => theme.ageRange.min <= 1 && theme.ageRange.max >= 1);
      } else if (ageGroup === '3-5') {
        themes = themes.filter(
          (theme) => theme.ageRange.min <= 5 && theme.ageRange.max >= 3
        );
      } else if (ageGroup === '6-9') {
        themes = themes.filter(
          (theme) => theme.ageRange.min <= 9 && theme.ageRange.max >= 6
        );
      } else if (ageGroup === '10+') {
        themes = themes.filter((theme) => theme.ageRange.min >= 10);
      }
    }

    if (featured) {
      themes = themes.filter((theme) => theme.featured);
    }

    return NextResponse.json({ themes });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json({ themes: [] }, { status: 200 });
  }
}

