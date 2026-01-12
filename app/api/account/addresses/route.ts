/**
 * 用户地址 API
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
  userId?: string;
  email: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email'); // 用于查询用户地址

    let addresses = await getAddresses();

    if (email) {
      addresses = addresses.filter((addr) => addr.email === email);
    }

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ addresses: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
    } = body;

    if (!email || !firstName || !lastName || !addressLine1 || !city || !postalCode || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const addresses = await getAddresses();

    // 如果设置为默认地址，取消其他默认地址
    if (isDefault) {
      addresses.forEach((addr) => {
        if (addr.email === email) {
          addr.isDefault = false;
        }
      });
    }

    const newAddress: Address = {
      id: `addr-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      email,
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault: isDefault || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addresses.push(newAddress);
    await saveAddresses(addresses);

    return NextResponse.json({ address: newAddress });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

