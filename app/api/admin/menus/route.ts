/**
 * Menus Management API
 * GET: Get all menus
 * POST: Create new menu
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { verifyAdminAuth } from '@/lib/api-auth';

const DATA_DIR = path.join(process.cwd(), 'data');
const MENUS_FILE = path.join(DATA_DIR, 'menus.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface MenuItem {
  id: string;
  label: string;
  url: string;
  type: 'page' | 'external' | 'anchor';
  children?: MenuItem[];
  order?: number;
}

interface Menu {
  id: string;
  name: string;
  location: 'header' | 'footer' | 'sidebar';
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

async function getMenus(): Promise<Menu[]> {
  try {
    await ensureDataDir();
    await fs.access(MENUS_FILE);
    const data = await fs.readFile(MENUS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Return default menus if file doesn't exist
    return [
      {
        id: 'header-menu',
        name: 'Header Menu',
        location: 'header',
        items: [
          { id: 'home', label: 'Home', url: '/', type: 'page', order: 0 },
          { id: 'kids-birthday', label: 'Kids Birthday', url: '/kids-birthday', type: 'page', order: 1 },
          { id: 'themes', label: 'Theme Packages', url: '/themes', type: 'page', order: 2 },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}

async function saveMenus(menus: Menu[]) {
  await ensureDataDir();
  await fs.writeFile(MENUS_FILE, JSON.stringify(menus, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');

    let menus = await getMenus();

    if (location) {
      menus = menus.filter((m) => m.location === location);
    }

    return NextResponse.json({ menus });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menus' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, location, items } = body;

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: name, location' },
        { status: 400 }
      );
    }

    const menus = await getMenus();

    // Check if menu with same name and location exists
    if (menus.some((m) => m.name === name && m.location === location)) {
      return NextResponse.json(
        { error: 'Menu with this name and location already exists' },
        { status: 400 }
      );
    }

    const newMenu: Menu = {
      id: `menu-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name,
      location,
      items: items || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    menus.push(newMenu);
    await saveMenus(menus);

    return NextResponse.json({ menu: newMenu }, { status: 201 });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: 'Failed to create menu' },
      { status: 500 }
    );
  }
}

