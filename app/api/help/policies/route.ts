/**
 * 政策内容 API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const POLICIES_FILE = path.join(DATA_DIR, 'help', 'policies.json');

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

async function getPolicies() {
  try {
    await ensureDataDir();
    await fs.access(POLICIES_FILE);
    const data = await fs.readFile(POLICIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'return' | 'shipping' | 'privacy'

    const policies = await getPolicies();

    if (type && policies[type]) {
      return NextResponse.json({ policy: policies[type] });
    }

    return NextResponse.json({ policies });
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json({ policies: {} }, { status: 200 });
  }
}

