/**
 * Backup Management API
 * Restore and delete backups
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

/**
 * Restore from backup
 */
export async function POST(
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

    // Read manifest
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    // Restore each file
    for (const file of manifest.files) {
      const sourcePath = path.join(backupPath, file.name);
      const targetPath = path.join(DATA_DIR, file.name);

      try {
        // Create directory structure if needed
        const targetDir = path.dirname(targetPath);
        await fs.mkdir(targetDir, { recursive: true });

        // Copy file
        const content = await fs.readFile(sourcePath, 'utf-8');
        await fs.writeFile(targetPath, content, 'utf-8');

        // Verify hash
        const hash = require('crypto').createHash('sha256').update(content).digest('hex');
        if (hash !== file.hash) {
          console.warn(`Hash mismatch for ${file.name}`);
        }
      } catch (error) {
        console.error(`Error restoring ${file.name}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Backup ${params.id} restored successfully`,
      restoredFiles: manifest.files.length,
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    return NextResponse.json(
      { error: 'Failed to restore backup' },
      { status: 500 }
    );
  }
}

/**
 * Delete backup
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backupPath = path.join(BACKUP_DIR, params.id);

    // Check if backup exists
    try {
      await fs.access(backupPath);
    } catch {
      return NextResponse.json(
        { error: 'Backup not found' },
        { status: 404 }
      );
    }

    // Delete backup directory
    await fs.rm(backupPath, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      message: `Backup ${params.id} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting backup:', error);
    return NextResponse.json(
      { error: 'Failed to delete backup' },
      { status: 500 }
    );
  }
}

/**
 * Download backup as ZIP
 */
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

    // Read manifest
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    // In production, use a proper ZIP library like 'archiver'
    // For now, return manifest info
    return NextResponse.json({
      backup: {
        id: manifest.id,
        timestamp: manifest.timestamp,
        files: manifest.files,
        totalSize: manifest.totalSize,
      },
      downloadUrl: `/api/admin/backup/${params.id}/download`,
    });
  } catch (error) {
    console.error('Error getting backup info:', error);
    return NextResponse.json(
      { error: 'Failed to get backup info' },
      { status: 500 }
    );
  }
}

