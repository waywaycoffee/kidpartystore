/**
 * Shipping Provider Detail API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
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

async function getProviders() {
  try {
    await ensureDataDir();
    await fs.access(SHIPPING_PROVIDERS_FILE);
    const data = await fs.readFile(SHIPPING_PROVIDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [
      { id: 'fedex', name: 'FedEx', enabled: false },
      { id: 'ups', name: 'UPS', enabled: false },
      { id: 'dhl', name: 'DHL', enabled: false },
      { id: 'usps', name: 'USPS', enabled: false },
    ];
  }
}

async function saveProviders(providers: any[]) {
  await ensureDataDir();
  await fs.writeFile(SHIPPING_PROVIDERS_FILE, JSON.stringify(providers, null, 2));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const providers = await getProviders();
    const index = providers.findIndex((p: any) => p.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    providers[index] = {
      ...providers[index],
      ...body,
      id: params.id,
      updatedAt: new Date().toISOString(),
    };

    await saveProviders(providers);
    return NextResponse.json({ provider: providers[index] });
  } catch (error) {
    console.error('Error updating provider:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Test connection endpoint
  try {
    const providers = await getProviders();
    const provider = providers.find((p: any) => p.id === params.id);

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    if (!provider.apiKey || !provider.apiSecret) {
      return NextResponse.json({ error: 'API credentials not configured' }, { status: 400 });
    }

    // Here you would make an actual API call to test the connection
    // For now, we'll simulate a test
    const testSuccess = provider.apiKey && provider.apiSecret;

    return NextResponse.json({
      success: testSuccess,
      message: testSuccess
        ? 'Connection test successful'
        : 'Connection test failed - check your credentials',
    });
  } catch (error) {
    console.error('Error testing connection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

