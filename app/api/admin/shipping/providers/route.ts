/**
 * Shipping Providers API
 */

import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SHIPPING_PROVIDERS_FILE = path.join(DATA_DIR, 'shipping-providers.json');

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
    await fs.access(SHIPPING_PROVIDERS_FILE);
    const data = await fs.readFile(SHIPPING_PROVIDERS_FILE, 'utf-8');
    const providers = JSON.parse(data);
    return NextResponse.json({ providers });
  } catch {
    // Return default providers
    const defaultProviders = [
      { id: 'fedex', name: 'FedEx', enabled: false },
      { id: 'ups', name: 'UPS', enabled: false },
      { id: 'dhl', name: 'DHL', enabled: false },
      { id: 'usps', name: 'USPS', enabled: false },
    ];
    return NextResponse.json({ providers: defaultProviders });
  }
}

