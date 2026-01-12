/**
 * Backup Download API
 * Export backup as JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backupPath = path.join(BACKUP_DIR, params.id);
    const manifestPath = path.join(backupPath, 'manifest.json');

    // Check if backup exists
    try {
      await fs.access(manifestPath);
    } catch {
      return NextResponse.json(
        { error: 'Backup not found' },
        { status: 404 }
      );
    }

    // Read all files and create export
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    const exportData: Record<string, unknown> = {
      version: '1.0',
      timestamp: manifest.timestamp,
      backupId: manifest.id,
      data: {},
    };

    // Read each file
    for (const file of manifest.files) {
      const filePath = path.join(backupPath, file.name);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        exportData.data[file.name] = JSON.parse(content);
      } catch (error) {
        console.error(`Error reading ${file.name}:`, error);
      }
    }

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="backup-${params.id}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting backup:', error);
    return NextResponse.json(
      { error: 'Failed to export backup' },
      { status: 500 }
    );
  }
}

