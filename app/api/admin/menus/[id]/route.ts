/**
 * Single Menu Management API
 * GET: Get menu by ID
 * PUT: Update menu
 * DELETE: Delete menu
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
    return [];
  }
}

async function saveMenus(menus: Menu[]) {
  await ensureDataDir();
  await fs.writeFile(MENUS_FILE, JSON.stringify(menus, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const menus = await getMenus();
    const menu = menus.find((m) => m.id === params.id);

    if (!menu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }

    return NextResponse.json({ menu });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const menus = await getMenus();
    const index = menus.findIndex((m) => m.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }

    menus[index] = {
      ...menus[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await saveMenus(menus);

    return NextResponse.json({ menu: menus[index] });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      { error: 'Failed to update menu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const menus = await getMenus();
    const filteredMenus = menus.filter((m) => m.id !== params.id);

    if (filteredMenus.length === menus.length) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }

    await saveMenus(filteredMenus);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu' },
      { status: 500 }
    );
  }
}

