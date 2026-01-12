/**
 * Bulk Product Import API
 * Import products from CSV or JSON file
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

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

function generateProductId(): string {
  return `prod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function validateProduct(product: any): { valid: boolean; error?: string } {
  // Required fields
  if (!product.name || typeof product.name !== 'string') {
    return { valid: false, error: 'Product name is required' };
  }
  if (product.price === undefined || typeof product.price !== 'number' || product.price < 0) {
    return { valid: false, error: 'Valid price is required' };
  }
  if (product.stock === undefined || typeof product.stock !== 'number' || product.stock < 0) {
    return { valid: false, error: 'Valid stock quantity is required' };
  }
  if (!product.category || typeof product.category !== 'string') {
    return { valid: false, error: 'Category is required' };
  }
  if (!product.status || !['active', 'draft', 'archived'].includes(product.status)) {
    return { valid: false, error: 'Valid status is required (active/draft/archived)' };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const text = await file.text();
    let products: any[] = [];

    // Parse file based on type
    if (fileType === 'csv') {
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        return NextResponse.json(
          { error: 'CSV file must have at least a header row and one data row' },
          { status: 400 }
        );
      }

      const headers = lines[0].split(',').map(h => h.trim());
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length !== headers.length) continue;

        const product: any = {};
        headers.forEach((header, index) => {
          const value = values[index].trim();
          if (value) {
            if (header === 'ageRange' || header === 'size' || header === 'material' || header === 'certification') {
              if (!product.attributes) product.attributes = {};
              product.attributes[header] = value;
            } else if (header === 'price' || header === 'stock' || header === 'estimatedDelivery') {
              product[header] = parseFloat(value) || 0;
            } else if (header === 'featured' || header === 'freeShipping') {
              product[header] = value.toLowerCase() === 'true';
            } else {
              product[header] = value;
            }
          }
        });

        if (!product.status) product.status = 'draft';
        if (product.stock === undefined) product.stock = 0;
        if (product.featured === undefined) product.featured = false;

        products.push(product);
      }
    } else if (fileType === 'json') {
      const data = JSON.parse(text);
      products = Array.isArray(data) ? data : [data];
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Use CSV or JSON.' },
        { status: 400 }
      );
    }

    // Validate and import products
    const existingProducts = await getProducts();
    const results: Array<{ success: boolean; error?: string; product?: any }> = [];
    let imported = 0;
    let failed = 0;

    for (const product of products) {
      const validation = validateProduct(product);
      
      if (!validation.valid) {
        results.push({ success: false, error: validation.error });
        failed++;
        continue;
      }

      // Add product with generated ID and timestamps
      const newProduct = {
        id: generateProductId(),
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      existingProducts.push(newProduct);
      results.push({ success: true, product: newProduct });
      imported++;
    }

    // Save all products
    await saveProducts(existingProducts);

    return NextResponse.json({
      success: true,
      imported,
      failed,
      total: products.length,
      results: results.slice(0, 10), // Return first 10 results
    });
  } catch (error) {
    console.error('Error importing products:', error);
    return NextResponse.json(
      { error: 'Failed to import products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}

