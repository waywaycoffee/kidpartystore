/**
 * Supplier Detail API
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const suppliers = await getSuppliers();
    const supplier = suppliers.find((s: any) => s.id === params.id);

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json({ supplier });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const suppliers = await getSuppliers();
    const index = suppliers.findIndex((s: any) => s.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    suppliers[index] = {
      ...suppliers[index],
      ...body,
      id: params.id,
      updatedAt: new Date().toISOString(),
    };

    await saveSuppliers(suppliers);
    return NextResponse.json({ supplier: suppliers[index] });
  } catch (error) {
    console.error('Error updating supplier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const suppliers = await getSuppliers();
    const filtered = suppliers.filter((s: any) => s.id !== params.id);

    if (suppliers.length === filtered.length) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    await saveSuppliers(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

