/**
 * Data Export API
 * Export all data as JSON
 */

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

const DATA_FILES = [
  'products.json',
  'orders.json',
  'addresses.json',
  'coupons.json',
  'themes.json',
  'settings.json',
  'help/faq.json',
  'help/policies.json',
  'blog/posts.json',
];

export async function GET() {
  try {
    const exportData: Record<string, unknown> = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {},
    };

    // Read each data file
    for (const file of DATA_FILES) {
      const filePath = path.join(DATA_DIR, file);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        exportData.data[file] = JSON.parse(content);
      } catch {
        // File doesn't exist, skip
      }
    }

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="export-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

