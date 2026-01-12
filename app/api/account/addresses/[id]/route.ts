/**
 * 用户地址详情 API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ADDRESSES_FILE = path.join(DATA_DIR, 'addresses.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface Address {
  id: string;
  email?: string;
  [key: string]: unknown;
}

async function getAddresses(): Promise<Address[]> {
  try {
    await ensureDataDir();
    await fs.access(ADDRESSES_FILE);
    const data = await fs.readFile(ADDRESSES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveAddresses(addresses: Address[]) {
  await ensureDataDir();
  await fs.writeFile(ADDRESSES_FILE, JSON.stringify(addresses, null, 2));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const addresses = await getAddresses();
    const index = addresses.findIndex((addr) => addr.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // If set as default address, unset other default addresses
    if (body.isDefault) {
      addresses.forEach((addr) => {
        if (addr.email === addresses[index].email && addr.id !== params.id) {
          addr.isDefault = false;
        }
      });
    }

    addresses[index] = {
      ...addresses[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await saveAddresses(addresses);

    return NextResponse.json({ address: addresses[index] });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const addresses = await getAddresses();
    const filtered = addresses.filter((addr) => addr.id !== params.id);

    if (filtered.length === addresses.length) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    await saveAddresses(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

