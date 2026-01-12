/**
 * Analytics Tracking API
 * 用户行为追踪API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function getAnalytics() {
  try {
    await ensureDataDir();
    await fs.access(ANALYTICS_FILE);
    const data = await fs.readFile(ANALYTICS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveAnalytics(analytics: any[]) {
  await ensureDataDir();
  await fs.writeFile(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, page, sessionId, device, userAgent } = body;

    if (!type || !page) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const analytics = await getAnalytics();
    const entry = {
      id: `analytics-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type, // 'pageview', 'add_to_cart', 'checkout_start', 'purchase'
      page,
      sessionId: sessionId || `session-${Date.now()}`,
      device: device || 'unknown',
      userAgent: userAgent || request.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    };

    analytics.push(entry);

    // Keep only last 10000 entries to prevent file from getting too large
    if (analytics.length > 10000) {
      analytics.splice(0, analytics.length - 10000);
    }

    await saveAnalytics(analytics);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

