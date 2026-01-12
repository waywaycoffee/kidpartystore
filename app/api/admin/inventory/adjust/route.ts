/**
 * Adjust Inventory API
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const INVENTORY_HISTORY_FILE = path.join(DATA_DIR, 'inventory-history.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function getProducts() {
  try {
    await ensureDataDir();
    await fs.access(PRODUCTS_FILE);
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveProducts(products: any[]) {
  await ensureDataDir();
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

async function getInventoryHistory() {
  try {
    await ensureDataDir();
    await fs.access(INVENTORY_HISTORY_FILE);
    const data = await fs.readFile(INVENTORY_HISTORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveInventoryHistory(history: any[]) {
  await ensureDataDir();
  await fs.writeFile(INVENTORY_HISTORY_FILE, JSON.stringify(history, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity, reason } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const products = await getProducts();
    const productIndex = products.findIndex((p: any) => p.id === productId);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = products[productIndex];
    const previousStock = product.stock || 0;
    const newStock = Math.max(0, previousStock + quantity);

    // Update product stock
    products[productIndex].stock = newStock;
    products[productIndex].updatedAt = new Date().toISOString();
    await saveProducts(products);

    // Record history
    const history = await getInventoryHistory();
    const historyEntry = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      productName: product.name,
      type: quantity > 0 ? 'in' : 'adjust',
      quantity: Math.abs(quantity),
      previousStock,
      newStock,
      reason: reason || 'Manual adjustment',
      createdAt: new Date().toISOString(),
    };

    history.unshift(historyEntry);
    await saveInventoryHistory(history);

    return NextResponse.json({
      success: true,
      product: products[productIndex],
      historyEntry,
    });
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

