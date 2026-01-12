/**
 * Suppliers API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SUPPLIERS_FILE = path.join(DATA_DIR, 'suppliers.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function getSuppliers() {
  try {
    await ensureDataDir();
    await fs.access(SUPPLIERS_FILE);
    const data = await fs.readFile(SUPPLIERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSuppliers(suppliers: any[]) {
  await ensureDataDir();
  await fs.writeFile(SUPPLIERS_FILE, JSON.stringify(suppliers, null, 2));
}

export async function GET() {
  try {
    const suppliers = await getSuppliers();
    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contactPerson, email, phone, address } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const suppliers = await getSuppliers();
    const newSupplier = {
      id: `supplier-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      contactPerson: contactPerson || '',
      email,
      phone: phone || '',
      address: address || '',
      rating: 5.0,
      totalOrders: 0,
      totalSpent: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    suppliers.push(newSupplier);
    await saveSuppliers(suppliers);

    return NextResponse.json({ supplier: newSupplier });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

