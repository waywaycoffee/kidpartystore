/**
 * FAQ API
 */

import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FAQ_FILE = path.join(DATA_DIR, 'help', 'faq.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  try {
    await fs.access(path.join(DATA_DIR, 'help'));
  } catch {
    await fs.mkdir(path.join(DATA_DIR, 'help'), { recursive: true });
  }
}

async function getFAQ() {
  try {
    await ensureDataDir();
    await fs.access(FAQ_FILE);
    const data = await fs.readFile(FAQ_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Return empty array if file doesn't exist
    return [];
  }
}

export async function GET() {
  try {
    const faq = await getFAQ();
    return NextResponse.json({ faq });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json({ faq: [] }, { status: 200 });
  }
}

