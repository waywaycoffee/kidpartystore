/**
 * Theme Settings API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const THEME_FILE = path.join(DATA_DIR, 'theme.json');

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
    await fs.access(THEME_FILE);
    const data = await fs.readFile(THEME_FILE, 'utf-8');
    const theme = JSON.parse(data);
    return NextResponse.json({ theme });
  } catch {
    // Return default theme if file doesn't exist
    return NextResponse.json({ theme: null });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme } = body;

    if (!theme) {
      return NextResponse.json({ error: 'Theme data required' }, { status: 400 });
    }

    await ensureDataDir();
    await fs.writeFile(THEME_FILE, JSON.stringify(theme, null, 2));

    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error('Error saving theme:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

