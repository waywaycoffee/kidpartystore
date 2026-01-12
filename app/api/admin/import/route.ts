/**
 * Data Import API
 * Import data from backup or external source
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Import data from JSON file
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, overwrite } = body;

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    await ensureDataDir();

    const importResults: Array<{ file: string; success: boolean; error?: string }> = [];

    // Import each data file
    for (const [fileName, fileData] of Object.entries(data)) {
      try {
        const filePath = path.join(DATA_DIR, fileName);

        // Check if file exists and overwrite flag
        if (!overwrite) {
          try {
            await fs.access(filePath);
            importResults.push({
              file: fileName,
              success: false,
              error: 'File already exists. Use overwrite=true to replace.',
            });
            continue;
          } catch {
            // File doesn't exist, proceed
          }
        }

        // Create directory structure if needed
        const fileDir = path.dirname(filePath);
        await fs.mkdir(fileDir, { recursive: true });

        // Write file
        await fs.writeFile(filePath, JSON.stringify(fileData, null, 2), 'utf-8');

        importResults.push({
          file: fileName,
          success: true,
        });
      } catch (error) {
        importResults.push({
          file: fileName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = importResults.filter((r) => r.success).length;
    const failCount = importResults.filter((r) => !r.success).length;

    return NextResponse.json({
      success: failCount === 0,
      imported: successCount,
      failed: failCount,
      results: importResults,
    });
  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json(
      { error: 'Failed to import data' },
      { status: 500 }
    );
  }
}

